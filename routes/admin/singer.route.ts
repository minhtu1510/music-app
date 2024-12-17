import express from "express";
const router = express.Router();
import * as controller from "../../controllers/admin/singer.controller";
router.get("/", controller.index);
export const singerRoute = router;
