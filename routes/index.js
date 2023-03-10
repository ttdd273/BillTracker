var express = require("express");
var router = express.Router();

// const bill_controller = require("../controllers/billController");
// const payment_controller = require("../controllers/paymentController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Bill Tracker" });
});

// router.get("/bills", bill_controller.index);
// router.get("/payments", payment_controller.index);

module.exports = router;
