// config file for passport

const User = require("../models/user");

// all the required packages for setting sessions and middleware management
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// configure passport to use a local strategy for authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          // done is a callback function passed to the authentication strategy
          // takes three arguments, error, user object if success, optional msg
          return done(null, false, { message: "Invalid email or password" });
        }

        // isVaildPassword should be a function defined on User model
        // and returns a boolean
        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// The serializeUser function is called by Passport.js to serialize the user
// object and store it in the session. In this case, it extracts the id property
// from the user object and passes it as the second argument to the done callback.
//  The done callback is a function that Passport.js provides to indicate that the serialization is complete.
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// The deserializeUser function is called by Passport.js to deserialize the user
// object from the session. It retrieves the user object based on the id passed as
// the first argument. In this example, it uses User.findById() to find the
// user by their id. Once the user object is retrieved, it is passed as the second
//  argument to the done callback, along with any potential error (err) that occurred during the process.
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
