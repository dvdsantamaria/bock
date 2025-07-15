import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Intercepta solo uploads de imagen
    if (
      ctx.request.files &&
      ctx.request.files.files &&
      ctx.request.files.files.type &&
      ctx.request.files.files.type.startsWith("image/")
    ) {
      const file = ctx.request.files.files;

      // Ruta del watermark SVG (ajustá si hace falta)
      const watermarkPath = path.join(__dirname, "../../public/watermark.svg");

      // Leé el SVG del watermark
      const watermarkSVG = await fs.readFile(watermarkPath);

      // Procesá la imagen con Sharp
      const image = sharp(file.path);
      const meta = await image.metadata();

      // Calculá el alto del watermark (15% del alto de la imagen)
      const wmHeight = Math.round((meta.height || 0) * 0.15);

      // Redimensioná el SVG
      const watermarkBuffer = await sharp(watermarkSVG)
        .resize({ height: wmHeight })
        .toBuffer();

      // Posición: margen 3% derecha y abajo
      const marginRight = Math.round((meta.width || 0) * 0.03);
      const marginBottom = Math.round((meta.height || 0) * 0.03);

      // Tamaño watermark
      const wmMeta = await sharp(watermarkBuffer).metadata();
      const left = (meta.width || 0) - (wmMeta.width || 0) - marginRight;
      const top = (meta.height || 0) - (wmMeta.height || 0) - marginBottom;

      // Aplica el watermark a la imagen original
      await image
        .composite([
          {
            input: watermarkBuffer,
            left,
            top,
            blend: "over",
          },
        ])
        .toFile(file.path + "_wm");

      // Reemplaza el archivo original por el watermarkeado
      await fs.rename(file.path + "_wm", file.path);
    }

    // Sigue el middleware chain
    await next();
  };
};
