import express from "express";
const router = express.Router();

// import * as controller from "../../controllers/auth.controller";
import * as controller from "../../controllers/auth.controller";
// import passport from "passport";

router.get("/login", controller.login);
router.post("/login", controller.loginPost);
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/auth/login",
//   }),
//   (req, res) => {
//     console.log(req.body);
//     res.redirect("/");
//   }
// );
router.get("/register", controller.register);
router.post("/register", controller.registerPost);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/reset", controller.resetPassword);
router.post("/password/reset", controller.resetPasswordPost);

export const authRoute = router;
