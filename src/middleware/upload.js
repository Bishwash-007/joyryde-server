import multer from 'multer';

// Memory storage keeps file buffers accessible for downstream upload (e.g., Cloudinary)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});
