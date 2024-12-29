import express from "express";
const router = express.Router();

import * as controller from "../../controllers/singer.controller";

router.get("/", controller.index);
router.get("/:slugSinger", controller.detail);
export const singersRoute = router;
