import { processEntryImage } from "../../../../utils/cloudinaryProcessor";

export default {
  async afterCreate(event) {
    await processEntryImage(event.result, {
      modelUid: "api::about.about",
      thumbPrefix: "imageThumb",
      fullField: "imageFull",
      posField: "thumbPos",
    });
  },
};
