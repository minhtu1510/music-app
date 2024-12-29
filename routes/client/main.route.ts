import express from "express";
const router = express.Router();

import * as controller from "../../controllers/main.controller";

router.get("/", controller.index);

export const mainRoute = router;
