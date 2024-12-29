import express from "express";
const router = express.Router();
import multer from "multer";
const upload = multer();
import * as controller from "../../controllers/admin/setting.controller";
import { uploadSingle } from "../../middlewares/admin/uploadCloud.middleware";
router.get("/general-hihi", controller.general);
router.patch(
  "/general",
  upload.single("logo"),
  uploadSingle,
  controller.generalPatch
);

export const settingRoute = router;
