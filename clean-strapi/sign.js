import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dwzxcpc6i",
  api_key: "963994173158246",
  api_secret: "GSKKGSH-P4_kx0DrdubY3RvUzxA",
});

// Datos de tu imagen y transformación
const publicId = "helicopter_flight_to_the_volcano_1_54ef987ef8_ydvmlw";
const transformation = "l:watermark,o_50,g_south_east,x_10,y_10";

// Generar URL firmada
const url = cloudinary.url(publicId, {
  transformation,
  type: "authenticated", // importante si la imagen es privada
  sign_url: true,
});

console.log("🖼️ URL firmada con watermark:", url);
