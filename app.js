var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// Routers
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var billsRouter = require("./routes/bills");
var paymentsRouter = require("./routes/payments");

// Authentication related
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticateUser = require("./middleware/auth");

const User = require("./models/user");

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
app.use("/users", authenticateUser, usersRouter);
app.use("/bills", authenticateUser, billsRouter);
app.use("/payments", authenticateUser, paymentsRouter);

// configure passport to use a local strategy for authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          // done is a callback function passed to the authentication strategy
          // takes three arguments, error, user object if success, optional msg
          return done(null, false, { message: "Invalid email or password" });
        }

        // isVaildPassword should be a function defined on User model
        // and returns a boolean
        const isMatch = await user.isValidPassword(password);

        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// catch 404 and forward to error handler
app.use(notFoundMiddleware);

// error handler
app.use(errorHandlerMiddleware);

module.exports = app;
