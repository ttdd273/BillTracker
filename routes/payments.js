const express = require("express");
const router = express.Router();
const payment_controller = require("../controllers/paymentController");

// GET request to display all the payments currently stored
router.get("/", payment_controller.index);

// Get request for creating a payment. This must come before routes that display payments
router.get("/create", payment_controller.payment_create_get);

// POST request for creating a payment
router.post("/create", payment_controller.payment_create_post);

// GET request to delete a payment
router.get("/:id/delete/", payment_controller.payment_delete_get);

// POST request to delete a payment
router.post("/:id/delete/", payment_controller.payment_delete_post);

// GET request to update a payment
router.get("/:id/update/", payment_controller.payment_update_get);

// POST request to update a payment
router.post("/:id/update/", payment_controller.payment_update_post);

// GET request for one payment.
router.get("/:id", payment_controller.payment_detail);

module.exports = router;
