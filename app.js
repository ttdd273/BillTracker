var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var billsRouter = require("./routes/bills");
var paymentsRouter = require("./routes/payments");

var app = express();

// get the dot environment file
require("dotenv").config();

// setting up the connection to mongoose
const mongoose = require("mongoose");
// set `strictQuery` to false to globally opt into filtering
// by properties that aren't in the schema
// we include it because it removes preparatory warnings for mongoose 7
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URI;
// console.log(process.env.MONGO_URI);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/bills", billsRouter);
app.use("/payments", paymentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
