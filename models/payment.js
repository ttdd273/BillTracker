const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// importing the constants for payment method
const { payment_methods } = require("../constants");

const PaymentSchema = new Schema({
  // we will need to require user in a later branch
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  billId: { type: Schema.Types.ObjectId, ref: "Bill", required: true },
  amount: { type: Number, required: true, min: 0 },
  payment_date: { type: Date, required: true },
  payment_method: {
    type: String,
    enum: payment_methods,
  },
});

// creating a virtual
PaymentSchema.virtual("url").get(function () {
  // we don't use the arrow function since we need to reference this
  return `/payments/${this._id}`;
});

module.exports = mongoose.model("Payment", PaymentSchema);
