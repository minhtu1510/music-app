import express from "express";
const router = express.Router();
import multer from "multer";
import * as controller from "../../controllers/admin/topic.controller";
import { uploadSingle } from "../../middlewares/admin/uploadCloud.middleware";
const upload = multer();
router.get("/", controller.index);
router.patch("/change-status", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadSingle,
  controller.editPatch
);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadSingle,
  controller.createPost
);

export const topicRoute = router;
