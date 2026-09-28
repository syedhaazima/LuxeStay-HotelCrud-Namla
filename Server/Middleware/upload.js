const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("UPLOAD DIRECTORY:", uploadDir);
    console.log("FILE RECEIVED:", file.originalname);

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);

    console.log("SAVING FILE AS:", fileName);

    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage
});

module.exports = upload;