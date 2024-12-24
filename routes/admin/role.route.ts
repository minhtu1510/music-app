import express from "express";
const router = express.Router();
import * as controller from "../../controllers/admin/role.controller";
router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.patch("/delete", controller.deletePatch);
router.delete("/delete", controller.deletee);
router.get("/permissions", controller.permissions);
router.patch("/permissions", controller.permissionsPatch);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);

export const roleRoute = router;
