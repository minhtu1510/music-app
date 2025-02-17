import express from "express";
const router = express.Router();
import multer from "multer";
import * as controller from "../../controllers/admin/singer.controller";
import { uploadSingle } from "../../middlewares/admin/uploadCloud.middleware";
const upload = multer();
router.get("/", controller.index);
router.patch("/change-status", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.patch("/delete", controller.deletePatch);
router.delete("/delete", controller.deletee);
router.get("/edit/:id", controller.edit);
router.get("/detail/:id", controller.detail);
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

export const singerRoute = router;
