import multer from "multer";

let upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    let fileTypes = /jpeg|jpg|png|gif/;
    let mimeType = fileTypes.test(file.mimetype);
    let extName = fileTypes.test(file.originalname.toLowerCase());

    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error("Only .jpeg, .jpg, .png, and .gif files are allowed!"));
  },
});

export default upload;
