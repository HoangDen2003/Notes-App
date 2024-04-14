const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

/**
 * todo: Login Google
 */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      // passReqToCallback: true,
    },
    async function (accessToken, refreshToken, profile, done) {
      const newUser = {
        googleId: profile.id,
        displayId: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };
      // console.log(newUser);
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
      }

      // console.log(profile);

      // return done(err, profile);
    }
  )
);

/**
 * todo: GET AUTH
 */
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
);

/**
 * * LOG OUT
 */
router.get("/logout", function (req, res) {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      res.send("Error loggin out");
    } else {
      res.redirect("/");
    }
  });
});

router.get("/login-failure", (req, res) => {
  // Successful authentication, redirect home.
  res.send("Something went wrong...");
});

// presist user data after successful authentication
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = router;
