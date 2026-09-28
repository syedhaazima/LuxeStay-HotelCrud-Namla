const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set UPLOAD_DIR to the mounted persistent-disk directory in production.
// Locally, keep uploads in Server/Uploads.
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, "..", "Uploads");

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
    const fileName = `${Date.now()}-${require("crypto").randomUUID()}${path.extname(file.originalname).toLowerCase()}`;

    console.log("SAVING FILE AS:", fileName);

    cb(null, fileName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  }
});

module.exports = upload;
module.exports.uploadDir = uploadDir;
