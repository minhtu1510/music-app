import express from "express";
const router = express.Router();

import * as controller from "../../controllers/auth.controller";

router.get("/login", controller.login);
router.get("/register", controller.register);

export const authRoute = router;
