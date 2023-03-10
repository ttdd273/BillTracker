const express = require("express");

exports.index = (req, res) => {
  res.render("bill_list", {
    title: "Bills",
  });
};

exports.bill_create_get = (req, res) => {
  res.send("bill create get");
};

exports.bill_create_post = (req, res) => {
  res.send("bill create post");
};

exports.bill_delete_get = (req, res) => {
  res.send("bill delete get");
};

exports.bill_delete_post = (req, res) => {
  res.send("bill delete post");
};

exports.bill_update_get = (req, res) => {
  res.send("bill update get");
};

exports.bill_update_post = (req, res) => {
  res.send("bill update post");
};

exports.bill_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: bill detail: ${req.params.id}`);
};
