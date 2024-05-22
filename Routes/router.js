const express = require("express");
const router = new express.Router();
const controllers = require("../controllers/userControllers");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// Routes
router.post("/user/register", controllers.userregister);
router.post("/user/sendotp", controllers.userOtpSend);
router.post("/user/login", controllers.userLogin);
router.post("/user/verifyotp", controllers.userOtpVerify);
router.post("/users/:userId/skills", controllers.signup);
router.post("/users/:userId/onboard", controllers.onBoard);
router.post("/users/:userId/asignmentdetails", controllers.assigDetails);
router.post(
  "/users/:userId/upload",
  upload.single("image"),
  controllers.UploadImage
);
router.get("/users/:userId/upload",controllers.GetProfileImages)

module.exports = router;
