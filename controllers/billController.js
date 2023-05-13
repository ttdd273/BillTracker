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

const sanitize_category = (category) => {
  if (!bill_categories.includes(category)) {
    throw new Error(`Invalid category: ${category}`);
  }
  return category;
};

// the controller specifies an array of middleware functions
// the array is passed to the router function and each method is called in order
// the approach is necessary because each validator function is a middleware
exports.bill_create_post = [
  // validate the name field is not empty, this is a body validator
  // the escape removes any dangerous characters
  body("name", "Bill name required").trim().isLength({ min: 1 }).escape(),
  body("amount", "Amount required")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isNumeric("Amount must be a number"),

  // the optional function runs a subsequent validation only if a field has been entered
  // the checkFalsy flag means we will accept either an empty string or null as empty value
  body("dueDate", "Invalid due date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  body("category").customSanitizer(sanitize_category),

  // we create a middleware function to extract any validation errors
  (req, res, next) => {
    // extract the validation errors from request
    const errors = validationResult(req);

    // create a bill object with escaped and trimmed data
    const bill = new Bill({
      name: req.body.name,
      amount: req.body.amount,
      dueDate: req.body.dueDate,
      category: req.body.category,
    });

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
  },
];

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

exports.bill_detail = (req, res, next) => {
  // if we call next more than once in a middleware function
  // it will often raise the error: Cannot set headers after they are sent to the client
  // res.send(`NOT IMPLEMENTED: bill detail: ${req.params.id}`);

  // rather than using async module, we will just use Promise.all to execute this

  const billPromise = Bill.findById(req.params.id).populate("userId").exec();

  Promise.all([billPromise])
    .then(([bill]) => {
      if (bill == null) {
        const err = new Error("Bill not found");
        err.status(404);
        throw err;
      } else {
        // successful, render the main page
        res.render("bill_detail", {
          bill: bill,
        });
      }
    })
    .catch((err) => {
      return next(err);
    });
};
