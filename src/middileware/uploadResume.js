const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw", // important for pdf/doc
    public_id: (req, file) => {
      return Date.now() + "-" + file.originalname.replace(/\s/g, "");
    }
  }
});

module.exports = multer({ storage });
