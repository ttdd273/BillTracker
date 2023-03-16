const express = require("express");

// for bills, we need to import the corresponding models
const Bill = require("../models/bill");
// because bills have users, we will also need to import that
const User = require("../models/user");

// we need the async module to get the database data quickly
const async = require("async");

// import the express validator module
const { body, validationResult } = require("express-validator");

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

// the controller specifies an array of middleware functions
// the array is passed to the router function and each method is called in order
// the approach is necessary because each validator function is a middleware
exports.bill_create_post = (req, res) => {
  // validate the name field is not empty, this is a body validator
  // the escape removes any dangerous characters
  body("name", "Bill name required").trim().isLength({ min: 1 }).escape();

  // we create a middleware function to extract any validation errors
  (req, res, next) => {
    // extract the validation errors from request
    const errors = validationResult(req);

    // create a bill object with escaped and trimmed data
    console.log(req);
    const bill = new Bill({ name: req.body.name });

    if (!errors.isEmpty()) {
      // there are errors, render the form again with sanitized error messages
      res.render("bill_form", {
        title: "Create Bill",
        bill,
        errors: errors.array(),
      });
      return;
    } else {
      // data form is valid, check if bill with the same name exists
      Bill.findOne({ name: req.body.name })
        .exec()
        .then((found_bill) => {
          if (found_bill) {
            res.redirect(found_bill.url);
          } else {
            bill
              .save()
              .then(() => {
                res.redirect(bill.url);
              })
              .catch((err) => {
                return next(err);
              });
          }
        })
        .catch((err) => {
          return next(err);
        });
    }
  };
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
