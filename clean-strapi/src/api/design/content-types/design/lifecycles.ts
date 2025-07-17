// ./src/api/design/content-types/design/lifecycles.ts

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

const downloadImage = async (url: string, dest: string) => {
  const response = await axios({ method: "GET", url, responseType: "stream" });
  await streamPipeline(response.data, fs.createWriteStream(dest));
};

const uploadToCloudinary = async (filePath: string, publicId: string) => {
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
  });
  return result.secure_url;
};

export default {
  async afterCreate(event) {
    try {
      const { result } = event;
      const imageUrl = result.imageFull?.url;

      console.log("🟡 afterCreate hook fired for ID:", result?.id);
      if (!imageUrl) {
        console.warn("⚠️ No imageFull.url found");
        return;
      }

      const allowedPositions = ["top", "center", "bottom"] as const;
      const thumbPos = allowedPositions.includes(result.thumbPos)
        ? result.thumbPos
        : "center";

      const match = imageUrl.match(/upload\/(v\d+\/[^.]+\.jpg)/);
      if (!match || match.length < 2) {
        console.error("❌ Could not extract baseTransform from URL:", imageUrl);
        return;
      }
      const baseTransform = match[1];

      const publicIdMatch = imageUrl.match(/upload\/v\d+\/([^\.]+)/);
      if (!publicIdMatch || publicIdMatch.length < 2) {
        console.error("❌ Could not extract publicId from URL:", imageUrl);
        return;
      }
      const publicId = publicIdMatch[1];

      const thumbTransform = `c_fill,ar_3:2,g_${thumbPos},w_300/${baseTransform}`;
      const watermarkTransform = `l_Artboard_1_2x_g8mel6,o_50,g_south_east,x_10,y_10/${baseTransform}`;

      const thumbUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/${thumbTransform}`;
      const watermarkUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/${watermarkTransform}`;

      const tmpThumb = path.join(tmpdir(), `${publicId}_thumb.jpg`);
      const tmpWatermark = path.join(tmpdir(), `${publicId}_watermark.jpg`);

      await downloadImage(thumbUrl, tmpThumb);
      await downloadImage(watermarkUrl, tmpWatermark);

      const uploadedThumb = await uploadToCloudinary(
        tmpThumb,
        `${publicId}_thumb-${thumbPos}`
      );
      const uploadedWatermark = await uploadToCloudinary(
        tmpWatermark,
        `${publicId}_watermark`
      );

      fs.unlinkSync(tmpThumb);
      fs.unlinkSync(tmpWatermark);

      const thumbKey = `imageThumb${thumbPos[0].toUpperCase()}${thumbPos.slice(1)}`;

      await strapi.entityService.update("api::design.design", result.id, {
        data: {
          imageWatermarked: uploadedWatermark,
          [thumbKey]: uploadedThumb,
        },
      } as any);

      console.log(`🎉 Image processing complete for design ID ${result.id}`);
    } catch (err) {
      console.error("❌ Error processing image in afterCreate:", err);
    }
  },
};
