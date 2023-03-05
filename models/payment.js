const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  billId: { type: Schema.Types.ObjectId, ref: "Bill" },
  amount: { type: Number, required: true, min: 0 },
  payment_date: { type: Date, required: true },
  payment_method: {
    type: String,
    enum: [
      "Cash",
      "Check",
      "Debit card",
      "Credit card",
      "Mobile payment",
      "Electronic bank transfer",
    ],
  },
});

// creating a virtual
PaymentSchema.virtual("url").get(function () {
  // we don't use the arrow function since we need to reference this
  return `/payments/${this._id}`;
});

module.exports = mongoose.model("Payment", PaymentSchema);
