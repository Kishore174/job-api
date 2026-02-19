"use strict";

var multer = require("multer");
var _require = require("multer-storage-cloudinary"),
  CloudinaryStorage = _require.CloudinaryStorage;
var cloudinary = require("../config/cloudinary");
var storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw",
    // important for pdf/doc
    public_id: function public_id(req, file) {
      return Date.now() + "-" + file.originalname.replace(/\s/g, "");
    }
  }
});
module.exports = multer({
  storage: storage
});