import AppError from "../utils/appError.js";
import multer from "multer";
import sharp from "sharp";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const updateMiddleware = upload.single("photo");

const resizeUserPhoto = (req, res, next) => {
  if (req.file) {
    const extension = req.file.mimetype.split("/")[1];
    req.file.filename = `user-${req.userId}-${Date.now()}.${extension}`;
    sharp(req.file.buffer)
      .resize(500, 500)
      .toFile(`public/img/users/${req.file.filename}`);
  }
  next();
};

export { updateMiddleware, resizeUserPhoto };
