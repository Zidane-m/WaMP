import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, `${Date.now()}-${randomName}${ext}`);
  }
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Hanya file JPG, PNG, atau WebP yang diperbolehkan.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2 MB
  }
});

export const uploadSingleImage = (req: Request, res: Response, next: NextFunction): void => {
  upload.single('gambar')(req, res, (err: unknown) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            error: {
              message: 'Validasi unggah file gagal',
              details: [{ field: 'gambar', message: 'Ukuran foto maksimal 2 MB' }]
            }
          });
          return;
        }
        res.status(400).json({
          error: {
            message: 'Validasi unggah file gagal',
            details: [{ field: 'gambar', message: err.message }]
          }
        });
        return;
      }

      if (err instanceof Error) {
        res.status(400).json({
          error: {
            message: 'Validasi unggah file gagal',
            details: [{ field: 'gambar', message: err.message }]
          }
        });
        return;
      }
    }

    next();
  });
};

export default uploadSingleImage;
