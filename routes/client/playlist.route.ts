import express from "express";
const router = express.Router();

import * as controller from "../../controllers/playlist.controller";

router.get("/", controller.index);
router.post("/", controller.createPlaylist);
router.patch("/addSong/:songId", controller.addSongPlaylist);
export const playlistRoute = router;
