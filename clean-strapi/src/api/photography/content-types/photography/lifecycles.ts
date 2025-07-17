// ./src/api/photography/content-types/photography/lifecycles.ts

import { processEntryImage } from "../../../../utils/cloudinaryProcessor";

export default {
  async afterCreate(event) {
    await processEntryImage(event.result, {
      modelUid: "api::photography.photography",
      thumbPrefix: "imageThumb",
      fullField: "imageFull",
      posField: "thumbPos",
    });
  },
};
