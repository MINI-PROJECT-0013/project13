const express = require("express");
const multer = require("multer");
const router = express.Router();
const {registerP, services, profile, users, userDelete} = require("../controllers/professionalControllers");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "professional_docs", // Folder name in Cloudinary
    allowedFormats: ["jpg", "png", "pdf"],
    resource_type: "auto", 
  },
});

const upload = multer({ storage });

router.route("/register").post(upload.single('document'), registerP);
router.route("/service").get(services);
router.route("/profile/:id").get(profile);
router.route("/profiles").get(users);
router.route("/profile/:id").delete(userDelete);

module.exports = router;
module.exports.upload = upload;