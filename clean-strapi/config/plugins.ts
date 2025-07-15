export default ({ env }) => {
  console.log("🧪 Cloudinary ENV", {
    name: env("CLOUDINARY_NAME"),
    key: env("CLOUDINARY_KEY"),
    secret: env("CLOUDINARY_SECRET"),
  });

  return {
    upload: {
      config: {
        provider: "cloudinary",
        providerOptions: {
          cloud_name: env("CLOUDINARY_NAME"),
          api_key: env("CLOUDINARY_KEY"),
          api_secret: env("CLOUDINARY_SECRET"),
        },
        actionOptions: {
          upload: {},
          delete: {},
        },
      },
    },
  };
};
