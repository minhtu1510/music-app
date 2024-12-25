import express from "express";
import multer from "multer";
const upload = multer();
const router = express.Router();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
import * as controller from "../../controllers/admin/account.controller";
router.get("/", controller.index);
router.get("/create", controller.create);
router.patch("/change-status", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.patch("/delete", controller.deletePatch);
router.delete("/delete", controller.deletee);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.createPost
);
router.get("/detail/:id", controller.detail);
router.get("/change-password/:id", controller.changePassword);
router.patch("/change-password/:id", controller.changePasswordPatch);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.editPatch
);
export const accountRoute = router;
