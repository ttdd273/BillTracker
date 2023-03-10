const express = require("express");
const router = express.Router();
const bill_controller = require("../controllers/billController");

// Get request for all bill information
router.get("/", bill_controller.index);

// Get request for creating a bill. This must come before routes that display bills
router.get("/create", bill_controller.bill_create_get);

// POST request for creating a bill
router.post("/create", bill_controller.bill_create_post);

// GET request to delete a bill
router.get("/:id/delete/", bill_controller.bill_delete_get);

// POST request to delete a bill
router.post("/:id/delete/", bill_controller.bill_delete_post);

// GET request to update a bill
router.get("/:id/update/", bill_controller.bill_update_get);

// POST request to update a bill
router.post("/:id/update/", bill_controller.bill_update_post);

// GET request for one bill.
router.get("/:id", bill_controller.bill_detail);

module.exports = router;
