const express = require("express");
const User = require("../models/user");

exports.user_signup_get = (req, res, next) => {
  res.send("users signup not implemented");
};

exports.user_signup_post = function (req, res, next) {
  res.send("users signup post not implemented");
};

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
