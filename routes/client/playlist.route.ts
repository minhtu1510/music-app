import express from "express";
const router = express.Router();

import * as controller from "../../controllers/playlist.controller";

router.get("/", controller.index);
router.get("/detail/:titlePlaylist", controller.detail);
router.patch("/detail/:titlePlaylist", controller.patchPlaylistTitle);
router.delete("/detail/:titlePlaylist", controller.deletePlaylist);
router.post("/", controller.createPlaylist);
router.patch("/addSong/:songId", controller.addSongPlaylist);
router.delete("/deleteSong/:songId", controller.deleteSongPlaylist);
export const playlistRoute = router;
