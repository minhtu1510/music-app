const passport = require("passport");
import { User } from "../models/user.model";
import { generateHelper } from "./generate.helper";
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user: any, done) => {
  console.log("serializeUser");
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("deserializeUser");
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
      callbackURL: "http://localhost:3000/auth/google/callback",
      // proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          console.log("da co");
          return done(null, existingUser);
        }
        const user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          fullName: profile.name.familyName + " " + profile.name.givenName,
          token: generateHelper(30),
        });
        console.log("tao moi");
        await user.save();
        return done(null, user);
      } catch (err) {
        console.log("loi");
        done(err, null);
      }
    }
  )
);

export default passport;
