const express = require("express");

// for bills, we need to import the corresponding models
const Bill = require("../models/bill");
// because bills have users, we will also need to import that
const User = require("../models/user");

// we need the async module to get the database data quickly
const async = require("async");

// get the globals
const { bill_categories } = require("../constants");

// Here's a good example of how to use the find function
/**
 * const Athlete = mongoose.model("Athlete", yourSchema);
 *
 * // find all athletes who play tennis, selecting the 'name' and 'age' fields
 * Athlete.find({ sport: "Tennis" }, "name age", (err, athletes) => {
 *   if (err) return handleError(err);
 *   // 'athletes' contains the list of athletes that match the criteria.
 * });
 */

// we will render all the bills we currently have
exports.index = function (req, res, next) {
  Bill.find({}, "name amount userId")
    .populate("userId")
    .exec()
    .then((list_bills) => {
      // successful, so render the list
      res.render("bill_list", {
        title: "Bills",
        bill_list: list_bills,
      });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.bill_create_get = (req, res) => {
  res.render("bill_form", {
    title: "Create Bill",
    bill_categories: bill_categories,
  });
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
