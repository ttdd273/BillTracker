const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
  // solution for validating an email
  // https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
    required: [true, "Email required"],
  },
  password: { type: String, trim: true, required: [true, "Password required"] },
});

// will need to come back to this for user functionality
UserSchema.virtual("url").get(function () {
  return `/${this._id}`;
});

module.exports = User;
