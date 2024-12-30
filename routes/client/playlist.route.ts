import express from "express";
const router = express.Router();

import * as controller from "../../controllers/playlist.controller";

router.get("/", controller.index);

export const playlistRoute = router;
