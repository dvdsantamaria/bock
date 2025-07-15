import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export default (config, { strapi }) => {
  return async (ctx, next) => {
    console.log("🟡 Middleware watermark activo");

    try {
      const files = ctx.request.files?.files;
      const isImage = files?.type?.startsWith("image/");

      if (!files) {
        console.log("⚪ No se encontró archivo en la request");
        return await next();
      }

      if (!isImage) {
        console.log("⚪ El archivo no es una imagen. Tipo:", files.type);
        return await next();
      }

      console.log("📷 Imagen detectada:", {
        name: files.name,
        path: files.path,
        size: files.size,
        type: files.type,
      });

      const watermarkPath = path.join(__dirname, "../../public/watermark.svg");
      const watermarkSVG = await fs.readFile(watermarkPath);

      const image = sharp(files.path);
      const meta = await image.metadata();

      console.log("🔍 Metadatos de la imagen:", meta);

      const wmHeight = Math.round((meta.height || 0) * 0.15);
      const watermarkBuffer = await sharp(watermarkSVG)
        .resize({ height: wmHeight })
        .toBuffer();

      const marginRight = Math.round((meta.width || 0) * 0.03);
      const marginBottom = Math.round((meta.height || 0) * 0.03);
      const wmMeta = await sharp(watermarkBuffer).metadata();

      const left = (meta.width || 0) - (wmMeta.width || 0) - marginRight;
      const top = (meta.height || 0) - (wmMeta.height || 0) - marginBottom;

      console.log("🧩 Posición del watermark:", { left, top });

      await image
        .composite([
          {
            input: watermarkBuffer,
            left,
            top,
            blend: "over",
          },
        ])
        .toFile(files.path + "_wm");

      console.log("✅ Watermark aplicado. Reemplazando archivo...");

      await fs.rename(files.path + "_wm", files.path);

      console.log("✅ Imagen reemplazada con éxito");
    } catch (err) {
      console.error("🔴 Error en middleware de watermark:", err);
    }

    await next();
  };
};
