const express = require("express");

const Bill = require("../models/bill");
const Payment = require("../models/payment");

exports.index = function (req, res, next) {
  Payment.find({}, "userId billId amount payment_date")
    // in order to get all the inforamtion from the bill
    // we need to call the populate method
    .populate("billId")
    .populate("userId")
    .exec()
    .then((list_payment) => {
      // successful, so render the list
      res.render("payment_list", {
        title: "Payments",
        payment_list: list_payment,
      });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.payment_create_get = (req, res) => {
  res.render("payment_form", { title: "Create Payment" });
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
