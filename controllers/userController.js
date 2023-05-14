const express = require("express");
const User = require("../models/user");

const { body, validationResult } = require("express-validator");

const bcrypt = require("bcrypt");

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

exports.user_login_post = function (req, res, next) {
  res.send("users login post not implemented");
};

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
