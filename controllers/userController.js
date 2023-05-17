const express = require("express");
const User = require("../models/user");

const { body, validationResult } = require("express-validator");

const bcrypt = require("bcrypt");

exports.all_users_get = (req, res, next) => {
  User.find({}, "first_name last_name email")
    .exec()
    .then((user_list) => {
      res.render("user_list", { title: "Users", user_list: user_list });
    });
};

exports.user_signup_get = (req, res, next) => {
  res.render("signup", {
    title: "Register",
  });
};

// the post function should usually be an array of middleware functions
exports.user_signup_post = [
  body("first_name", "First name required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last name required").trim().isLength({ min: 1 }).escape(),
  // validating email using express-validator
  body("email", "Email required")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password", "Password required").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    // create a new user with a salted password
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      // render the form again with errors attached
      res.render("signup", {
        title: "Register",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      // data form is valid, let's save it to the database
      User.findOne({ email: user.email })
        .exec()
        .then((existingUser) => {
          if (existingUser) {
            // User already exists, render the form again with an error message
            res.render("signup", {
              title: "Register",
              user: user,
              error: "User already exists",
            });
            return;
          } else {
            // otherwise, we're good to save the user

            bcrypt
              .hash(user.password, 10)
              .then((hashedPassword) => {
                user.password = hashedPassword;

                user
                  .save()
                  .then(() => {
                    res.redirect(user.url);
                  })
                  .catch((err) => {
                    return next(err);
                  });
              })
              .catch((err) => {
                return next(err);
              });
          }
        })
        .catch((err) => {
          // Handle any errors that occurred during the process
          // console.error("Error finding user:", err);
          // return res.status(500).json({ error: "Server error" });
          return next(err);
        });
    }
  },
];
// (req, res, next) => {
//   // res.send("users login post not implemented");
//   res.render("bill_detail", {
//     title: "Register",
//   });
// };

exports.user_login_get = (req, res, next) => {
  res.render("login", {
    title: "Login",
  });
};

// this function will also be an array of middleware functions
exports.user_login_post = [
  body("email", "Email required")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password", "Password required").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("login", {
        title: "Login",
        user: { email: email },
        errors: errors.array(),
      });
    }

    // we will actually try to find the user
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.render("login", {
            title: "Login",
            user: { email: email },
            error: "Invalid email or password",
          });
        }

        return bcrypt.compare(password, user.password).then((is_match) => {
          if (is_match) {
            // Passwords match, authentication successful
            // Set up session or issue JWT token
            req.session.userId = user._id; // Store user ID in the session
            return res.redirect("/dashboard"); // Redirect to the dashboard or authenticated area
          } else {
            return res.render("login", {
              title: "Login",
              user: { email: email },
              error: "Invalid email or password",
            });
          }
        });
      })
      .catch((err) => {
        return next(err);
      });
  },
];

exports.user_logout_post = function (req, res, next) {
  res.send("users logout post not implemented");
};

exports.user_profile_get = function (req, res, next) {
  const userPromise = User.findById(req.params.id).exec();

  Promise.all([userPromise]).then(([user]) => {
    if (user == null) {
      const err = new Error("User not found");
      err.status(404);
      throw err;
    } else {
      // successful, render the main page
      res.render("user_detail", {
        user: user,
      });
    }
  });
};

exports.user_profile_edit_get = function (req, res, next) {
  res.send("users profile get edit not implemented");
};

exports.user_profile_put = function (req, res, next) {
  res.send("users profile put edit not implemented");
};
