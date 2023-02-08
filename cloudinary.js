import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Upload
export const uploadFiles = async (files) =>
  files.map(async (file) => {
    const res = cloudinary.uploader.upload(file.path, {
      public_id: file.filename,
    });
    try {
      return await res;
    } catch (err) {
      return err;
    }
  });
