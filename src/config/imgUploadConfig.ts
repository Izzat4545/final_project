import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import fs from "fs";
import { getEnv } from "../utils/getEnv";
import { logger } from "./logger/loggerMain";
import path from "path";

// Set up Multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getEnv("STATIC_FILES"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filtering (allowing only image files)
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};
const MB = 1024 * 1024;
const MAX_FILE_SIZE_MB = 5;

const fileSize = MAX_FILE_SIZE_MB * MB;
export const upload = multer({
  storage,
  limits: { fileSize: fileSize },
  fileFilter,
});

export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    const fullPath = path.resolve(imagePath);

    const fileExists = await fs.promises
      .access(fullPath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      await fs.promises.unlink(fullPath);
      logger.info(`Deleted image: ${fullPath}`);
    }
  } catch (error) {
    logger.error("Error deleting image:", error);
  }
};
