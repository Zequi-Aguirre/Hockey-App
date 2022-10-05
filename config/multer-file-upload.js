const multer = require("multer");

let fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/xlsx");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadFile = multer({ storage: fileStorageEngine });

module.exports = uploadFile;
