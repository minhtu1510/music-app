import express from "express";
const router = express.Router();

import * as controller from "../../controllers/song.controller";

router.get("/:slugTopic", controller.index);

export const songsRoute = router;
