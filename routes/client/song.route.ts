import express from "express";
const router = express.Router();

import * as controller from "../../controllers/song.controller";

router.get("/:slugTopic", controller.index);

router.get("/detail/:slugSong", controller.detail);

router.patch("/like", controller.likePatch);

router.patch("/favorite", controller.favoritePatch);

export const songsRoute = router;
