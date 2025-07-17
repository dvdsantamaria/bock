// src/utils/cloudinaryProcessor.ts
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import { promisify } from "util";
import { pipeline } from "stream";

const streamPipeline = promisify(pipeline);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/* --------------------------------------------------------- */
/*  Helpers internos                                          */
/* --------------------------------------------------------- */
const warmUp = async (url: string) => {
  try {
    await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 3_000,
    });
  } catch (_) {
    /* Cloudinary puede responder 202/4xx: es suficiente */
  }
};

const downloadImage = async (url: string, dest: string) => {
  const res = await axios({ method: "GET", url, responseType: "stream" });
  await streamPipeline(res.data, fs.createWriteStream(dest));
};

const uploadToCloudinary = async (file: string, publicId: string) => {
  const { secure_url } = await cloudinary.uploader.upload(file, {
    public_id: publicId,
    overwrite: true,
  });
  return secure_url;
};

/* --------------------------------------------------------- */
/*  API pública                                               */
/* --------------------------------------------------------- */
export interface ProcessorConfig {
  /** UID de Strapi, ej: 'api::about.about' */
  modelUid: string;
  /** Prefijo de los thumbs, ej: 'imageThumb' → imageThumbTop|Center|Bottom */
  thumbPrefix: string;
  /** Campo del entry con la URL original (media) */
  fullField: "imageFull";
  /** Campo con la enumeración 'top|center|bottom'  */
  posField: "thumbPos";
}

export async function processEntryImage(entry: any, cfg: ProcessorConfig) {
  const imageUrl: string | undefined = entry[cfg.fullField]?.url;
  if (!imageUrl) return;

  /* ---------- thumb position ---------- */
  const rawPos = entry[cfg.posField] ?? "center";
  const thumbPos = ["top", "center", "bottom"].includes(rawPos)
    ? rawPos
    : "center";

  /* ---------- publicId ---------- */
  const m = imageUrl.match(/\/v\d+\/([^\.\/]+)/);
  if (!m) return;
  const publicId = m[1];
  const cloudName = process.env.CLOUDINARY_NAME!;

  /* ---------- URLs con named transformations ---------- */
  const thumbURL = `https://res.cloudinary.com/${cloudName}/image/upload/t_thumb_${thumbPos}/${publicId}.jpg`;
  const wmURL = `https://res.cloudinary.com/${cloudName}/image/upload/t_public/${publicId}.jpg`;

  /* 1) Forzamos generación */
  await Promise.all([warmUp(thumbURL), warmUp(wmURL)]);
  await new Promise((r) => setTimeout(r, 300)); // breve wait

  /* 2) Descargamos ya procesadas */
  const tmpThumb = path.join(tmpdir(), `${publicId}_thumb.jpg`);
  const tmpWM = path.join(tmpdir(), `${publicId}_wm.jpg`);
  await Promise.all([
    downloadImage(thumbURL, tmpThumb),
    downloadImage(wmURL, tmpWM),
  ]);

  /* 3) Re-subimos ocultando la original */
  const upThumb = await uploadToCloudinary(
    tmpThumb,
    `${publicId}_thumb-${thumbPos}`
  );
  const upWM = await uploadToCloudinary(tmpWM, `${publicId}_watermark`);

  fs.unlinkSync(tmpThumb);
  fs.unlinkSync(tmpWM);

  /* 4) Persistimos en Strapi */
  const thumbKey = `${cfg.thumbPrefix}${thumbPos[0].toUpperCase()}${thumbPos.slice(1)}`;

  await strapi.entityService.update(cfg.modelUid as any, entry.id, {
    data: { [thumbKey]: upThumb, imageWatermarked: upWM },
  });

  console.log(`✅ Imágenes procesadas (${cfg.modelUid} #${entry.id})`);
}
