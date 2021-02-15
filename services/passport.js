const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");
// const User = mongoose.model('users) is a type of require statement. This is how you pull schemas out of mongoose. User is the model class.

// serialize user is giving the cookie authentication a token which can then be used to authenticate the user.
// it's taking user and done that were defined in the passport.use function
passport.serializeUser((user, done) => {
  done(null, user.id);
  // done is a callback function. null is to say there is no error here. user.id is what is used as the cookie's token.  If you look at the database documentation it's referring to _id .Not to be confused with the profile.id that references google.id
});

// deserialize is for when the user logs out.
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true,
      //the callbackURL has a domain appended by google strategy, enabling a bit more flexibility
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("access token", accessToken);
      console.log("refresh token", refreshToken);
      console.log("profile", profile);
      // console logs to quickly reference login instance information

      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // checks to see if the user already exists or not
        return done(null, existingUser);
      }
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
      // saves a new user to the 'users' collection
    }
  )
);
