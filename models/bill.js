// import the mongoose module
const mongoose = require("mongoose");

// models are created using mongoose.model()
// define schema
const Schema = mongoose.model();

// reminders can be an array of dates of when the user wants to be reminded
// but for now we won't include it

const BillSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true, maxLength: 1000 },
  amount: { type: Number, min: [0, "Amount cannot be negative"] },
  // the ref property tells the scame which model can be assigned to this field
  dueDate: { type: Date },
  category: {
    type: String,
    enum: [
      "Housing",
      "Transportation",
      "Food",
      "Utilities",
      "Clothing",
      "Healthcare",
      "Insurance",
      "Household Supplie",
      "Persona",
      "Deb",
      "Retiremen",
      "Educatio",
      "Savings",
      "Gift",
      "Entertainment",
    ],
  },
});

// documents are like records in a table
// virtual properties are document properties that can be get and set
// but they don't persist in mongodb

// The getters are useful for formatting or combining fields,
// while setters are useful for de-composing a single value into multiple values for storage.

// we will create a virtual for the url of the bill
BillSchema.virtual("url").get(function () {
  // we don't use the arrow function since we need to reference this
  return `/bills/${this._id}`;
});

// export the model
module.exports = mongoose.model("Bill", BillSchema);
