import express from "express";
const router = express.Router();

import * as controller from "../../controllers/topic.controller";

router.get("/", controller.index);

export const topicsRoute = router;
