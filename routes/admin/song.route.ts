import { Router } from "express";
const router: Router = Router();
import multer from "multer"; // để lấy được ảnh upload
import * as controller from "../../controllers/admin/song.controller";
import { uploadSingle } from "../../middlewares/admin/uploadCloud.middleware";

const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadSingle,
  controller.createPost
);
export const songRoute: Router = router;
