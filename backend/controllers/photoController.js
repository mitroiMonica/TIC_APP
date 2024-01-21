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
  try {
    if (req.file) {
      let path = "";
      if (req.baseUrl.includes("users")) {
        path = "user";
      } else if (req.baseUrl.includes("recipes")) {
        path = "recipe";
      } else {
        throw new AppError(
          "Image upload is not allowed with this request",
          400
        );
      }
      const extension = req.file.mimetype.split("/")[1];
      req.file.filename = `${path}-${req.userId}-${Date.now()}.${extension}`;
      sharp(req.file.buffer)
        .resize(500, 500)
        .toFile(`public/img/${path}s/${req.file.filename}`);
    }
    next();
  } catch (err) {
    next(err);
  }
};

export { updateMiddleware, resizeUserPhoto };
