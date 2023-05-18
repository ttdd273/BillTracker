// setting up the connection to mongoose
const mongoose = require("mongoose");

// set `strictQuery` to false to globally opt into filtering
// by properties that aren't in the schema
// we include it because it removes preparatory warnings for mongoose 7
mongoose.set("strictQuery", false);

const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;
