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
const session = require("express-session");
const passport = require("./config/passport-config");

// Middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticateUser = require("./middleware/auth");

var app = express();

// get the dot environment file
require("dotenv").config();

const connectDB = require("./config/connect-db");
const mongoDB = process.env.MONGO_URI;
// console.log(process.env.MONGO_URI);

main().catch((err) => console.log(err));

async function main() {
  await connectDB(mongoDB);
}

// authentication
app.use(
  // session is a middleware function provided by express-session
  // creates a session middleware that manages session data for each user
  session({
    // secret is a string used to sign the session ID cookie
    // should be a secret value unique to the application
    secret: "bill-tracker-key",
    // resave specifies whether a session should be saved even if it was not
    // modified during the request, setting it to false optimizes performance
    // by preventing unncessary saves
    resave: false,
    // determines whether a new, uninitialized session should be saved to store
    // setting to false helps comply with privacy regulations and avoids
    // saving empty sessions
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
//  middleware is used to support persistent login sessions. It relies on the
// session middleware to deserialize user objects stored in the session and
// attach them to the req.user property.
app.use(passport.session());

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

// catch 404 and forward to error handler
app.use(notFoundMiddleware);

// error handler
app.use(errorHandlerMiddleware);

module.exports = app;
