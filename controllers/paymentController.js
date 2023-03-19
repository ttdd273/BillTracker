const express = require("express");

const Bill = require("../models/bill");
const Payment = require("../models/payment");

// importing the constant for payment method
const { payment_methods } = require("../constants");

// importing express validator module
const { body, validationResult } = require("express-validator");

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

exports.payment_create_get = (req, res, next) => {
  const billPromise = Bill.find();

  Promise.all([billPromise])
    .then(([bills]) => {
      res.render("payment_form", {
        title: "Create Payment",
        bills: bills,
        payment_methods: payment_methods,
      });
    })
    .catch((err) => next(err));
};

const sanitize_method = (method) => {
  if (!payment_methods.includes(method)) {
    throw new Error(`Invalid method: ${method}`);
  }
  return method;
};

// again, this needs to be an array of middlewares that will be executed in order
exports.payment_create_post = [
  // validate and sanitize all fields
  body("billId").escape(),
  body("amount", "Amount must not be empty")
    .trim()
    .isLength({ min: 1 })
    .isNumeric()
    .withMessage("Amount must be a number")
    .escape(),
  body("payment_date", "Payment date must not be empty")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  // body("payment_method").customSanitizer(sanitize_method),

  // middleware function to extract validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    // console.log(req.body);
    const payment = new Payment({
      // this is really important, req.body sends information
      // with the name on the form, not the name in the model
      billId: req.body.bill,
      amount: req.body.amount,
      payment_date: req.body.payment_date,
      payment_method: req.body.payment_method,
    });

    if (!errors.isEmpty()) {
      // there are errors, render the form again with sanitized error messages
      const billPromise = Bill.find();

      Promise.all([billPromise])
        .then(([bills]) => {
          res.render("payment_form", {
            title: "Create Payment",
            bills: bills,
            payment_methods: payment_methods,
            payment,
            errors: errors.array(),
          });
        })
        .catch((err) => next(err));

      return;
    } else {
      // data form is valid, check if bill with the same name exists
      payment
        .save()
        .then(() => {
          res.redirect(payment.url);
        })
        .catch((err) => {
          return next(err);
        });
    }
  },
];

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

exports.payment_detail = (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: payment detail: ${req.params.id}`);
  const paymentPromise = Payment.findById(req.params.id)
    // note that this is how you populate nested documents
    .populate({ path: "billId", populate: { path: "userId" } })
    .exec();

  Promise.all([paymentPromise])
    .then(([payment]) => {
      if (payment == null) {
        const err = new Error(`Payment not found`);
        err.status = 404;
        throw err;
      } else {
        res.render("payment_detail", { payment: payment });
      }
    })
    .catch((err) => {
      return next(err);
    });
};
