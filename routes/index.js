var express = require("express");
var router = express.Router();
// const bill_controller = require("../controllers/billController");
// const payment_controller = require("../controllers/paymentController");

const Bill = require("../models/bill");
const Payment = require("../models/payment");

const async = require("async");

// we want to get all the basic information on the home page
// using an async parallel call

/* Unforunately, mongoose 7 doesn't accept callbacks anymore*/
/* GET home page. */
// router.get("/", function (req, res, next) {
//   // we are defining new functions in this async parallel function
//   async.parallel(
//     {
//       bill_count(callback) {
//         Bill.countDocuments({}, callback); // Pass an empty object as match condition to find all documents in this collection
//       },
//       payment_count(callback) {
//         Payment.countDocuments({}, callback);
//       },
//     },
//     (err, results) => {
//       res.render("index", { title: "Bill Tracker", error: err, data: results });
//     }
//   );
// });

/* GET Home Page */
router.get("/", function (req, res, next) {
  Promise.all([Bill.countDocuments({}), Payment.countDocuments({})])
    .then((counts) => {
      const [billCount, paymentCount] = counts;
      res.render("index", {
        title: "Bill Tracker",
        data: { bill_count: billCount, payment_count: paymentCount },
      });
    })
    .catch((err) => {
      res.render("index", { title: "Bill Tracker", error: err });
    });
});

// router.get("/bills", bill_controller.index);
// router.get("/payments", payment_controller.index);

module.exports = router;
