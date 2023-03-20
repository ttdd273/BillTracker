const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  // res.send("users");
  res.redirect("/home");
});

// Working on user functionality

module.exports = router;
