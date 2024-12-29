import express from "express";
const router = express.Router();
import * as controller from "../../controllers/admin/auth.controller";
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
export const authRoute = router;
