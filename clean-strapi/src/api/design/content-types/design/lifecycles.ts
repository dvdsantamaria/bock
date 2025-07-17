import { processEntryImage } from "../../../../utils/cloudinaryProcessor";

export default {
  async afterCreate(event) {
    await processEntryImage(event.result, {
      modelUid: "api::design.design",
      thumbPrefix: "imageThumb",
      fullField: "imageFull",
      posField: "thumbPos",
    });
  },
};
