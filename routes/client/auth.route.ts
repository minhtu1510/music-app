import express from "express";
const router = express.Router();

// import * as controller from "../../controllers/auth.controller";
import * as controller from "../../controllers/auth.controller";
import { requireAuth } from "../../middlewares/client/user.middleware";
import passport from "passport";
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/topics",
  }),
  (req, res) => {
    const user: any = req.user;
    res.cookie("tokenUser", user.token);
    res.redirect("/auth/login");
  }
);
router.get("/register", controller.register);
router.post("/register", controller.registerPost);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/reset", controller.resetPassword);
router.post("/password/reset", controller.resetPasswordPost);
router.get("/profile", requireAuth, controller.profile);
router.patch("/profile/:id", requireAuth, controller.profilePatch);

export const authRoute = router;
