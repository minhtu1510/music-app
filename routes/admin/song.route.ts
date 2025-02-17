import { Router } from "express";
const router: Router = Router();
import multer from "multer"; // để lấy được ảnh upload
import * as controller from "../../controllers/admin/song.controller";
import { uploadFields } from "../../middlewares/admin/uploadCloud.middleware";

const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.patch("/change-status", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.patch("/change-type", controller.changeType);
router.patch("/delete", controller.deletePatch);
router.delete("/delete", controller.deletee);
router.get("/detail/:id", controller.detail);
router.post(
  "/create",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadFields,
  controller.createPost
);
router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  uploadFields,
  controller.editPatch
);

export const songRoute: Router = router;
