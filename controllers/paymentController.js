const express = require("express");

exports.index = (req, res) => {
  res.render("payment_list", { title: "Payments" });
};

exports.payment_create_get = (req, res) => {
  res.send("payment create get");
};

exports.payment_create_post = (req, res) => {
  res.send("payment create post");
};

exports.payment_delete_get = (req, res) => {
  res.send("payment delete get");
};

exports.payment_delete_post = (req, res) => {
  res.send("payment delete post");
};

exports.payment_update_get = (req, res) => {
  res.send("payment update get");
};

exports.payment_update_post = (req, res) => {
  res.send("payment update post");
};

exports.payment_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: payment detail: ${req.params.id}`);
};
