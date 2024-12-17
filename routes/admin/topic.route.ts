import express from "express";
const router = express.Router();
import * as controller from "../../controllers/admin/topic.controller";
router.get("/", controller.index);
router.patch("/change-status", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
export const topicRoute = router;
