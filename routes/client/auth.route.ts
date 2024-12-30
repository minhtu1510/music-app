import express from "express";
const router = express.Router();

// import * as controller from "../../controllers/auth.controller";
import * as controller from "../../controllers/auth.controller";
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/register", controller.register);
router.get("/logout", controller.logout);

export const authRoute = router;
