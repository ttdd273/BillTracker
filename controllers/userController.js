const express = require("express");
const User = require("../models/user");

const { body, validateResult } = require("express-validator");

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
  body("email", "Email required").trim().isLength({ min: 1 }).escape(),
  body("password", "Password required").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validateResult(req);

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
  res.send("users profile get not implemented");
};

exports.user_profile_edit_get = function (req, res, next) {
  res.send("users profile get edit not implemented");
};

exports.user_profile_put = function (req, res, next) {
  res.send("users profile put edit not implemented");
};
