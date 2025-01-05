import express from "express";
const router = express.Router();

import * as controller from "../../controllers/song.controller";

router.get("/detail/:slugSong", controller.detail);

router.patch("/like", controller.likePatch);

router.patch("/favorite", controller.favoritePatch);

router.get("/favorite", controller.favorite);
router.post("/check-premium", controller.checkPremium);


// router.get("/playlist", controller.playlist);


router.get("/search/:type", controller.search);

router.patch("/listen/:id", controller.listenPatch);

router.get("/:slugTopic", controller.index);

export const songsRoute = router;
