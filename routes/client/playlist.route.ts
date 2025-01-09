import express from "express";
const router = express.Router();

import * as controller from "../../controllers/playlist.controller";

router.get("/", controller.index);
router.get("/detail/:slugPlaylist", controller.detail);
router.patch("/detail/:slugPlaylist", controller.patchPlaylistTitle);
router.delete("/detail/:slugPlaylist", controller.deletePlaylist);
router.post("/", controller.createPlaylist);
router.patch("/addSong/:songId", controller.addSongPlaylist);

router.delete("/deleteSong/:songId", controller.deleteSongPlaylist);

export const playlistRoute = router;
