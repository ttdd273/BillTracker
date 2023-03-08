#! /usr/bin/env node

// trying out the pull request feature

console.log(
  'This script populates some test users, payments, and bills to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// note that we actually need to change the name inside the URI
// for it to go to the correct collection, otherwise, it'll just go to test collection

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

// console.log("before hello");
const async = require("async");
// console.log("before hello 1");
const User = require("./models/user");
// console.log("before hello 2");
const Payment = require("./models/payment");
// console.log("before hello 3");
const Bill = require("./models/bill");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
console.log("connected to mongo");

const users = [];
const bills = [];
const payments = [];

// cb is a callback function
function userCreate(first_name, last_name, email, password, cb) {
  userdetail = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
  };

  const user = new User(userdetail);

  user
    .save()
    .then(() => {
      console.log("New User: " + user);
      users.push(user);
      cb(null, user);
    })
    .catch((err) => {
      cb(err, null);
      return;
    });

  // user.save(function (err) {
  //   if (err) {
  //     cb(err, null);
  //     return;
  //   }
  //   console.log("New User: " + user);
  //   users.push(user);
  //   cb(null, user);
  // });
}

function billCreate(userId, name, amount, dueDate, category, cb) {
  const bill = new Bill({
    userId: userId,
    name: name,
    amount: amount,
    dueDate: dueDate,
    category: category,
  });

  bill
    .save()
    .then(() => {
      console.log("New Bill: " + bill);
      bills.push(bill);
      cb(null, bill);
    })
    .catch((err) => {
      cb(err, null);
      return;
    });

  // bill.save(function (err) {
  //   if (err) {
  //     cb(err, null);
  //     return;
  //   }
  //   console.log("New Bill: " + bill);
  //   bills.push(bill);
  //   cb(null, bill);
  // });
}

function paymentCreate(
  userId,
  billId,
  amount,
  payment_date,
  payment_method,
  cb
) {
  const payment = new Payment({
    userId: userId,
    billId: billId,
    amount: amount,
    payment_date: payment_date,
    payment_method: payment_method,
  });

  payment
    .save()
    .then(() => {
      console.log("New payment: " + payment);
      payments.push(payment);
      cb(null, payment);
    })
    .catch((err) => {
      // console.log("callback:" + cb);
      cb(err, null);
      return;
    });

  // payment.save(function (err) {
  //   if (err) {
  //     cb(err, null);
  //     return;
  //   }
  //   console.log("New Payment: " + payment);
  //   payments.push(payment);
  //   cb(null, payment);
  // });
}

function createUsers(cb) {
  async.series(
    [
      function (callback) {
        userCreate(
          "Patrick",
          "Rothfuss",
          "rothfuss@gmail.com",
          "guest",
          callback
        );
      },
      function (callback) {
        userCreate("Ben", "Bova", "bova@gmail.com", "guest", callback);
      },
      function (callback) {
        userCreate("Isaac", "Asimov", "asimov@gmail.com", "guest", callback);
      },
      function (callback) {
        userCreate("Bob", "Billings", "billings@gmail.com", "guest", callback);
      },
      function (callback) {
        userCreate("Jim", "Jones", "jones@gmail.com", "guest", callback);
      },
    ],
    // optional callback
    cb
  );
}

function createBills(cb) {
  async.parallel(
    [
      function (callback) {
        // the pass in the userId, we will have to pass in the object itself
        billCreate(users[0], "Dinner", 74.44, "2023-03-06", "Food", callback);
      },
      function (callback) {
        billCreate(
          users[1],
          "Electricity",
          34.44,
          "2023-02-06",
          "Utilities",
          callback
        );
      },
      function (callback) {
        billCreate(
          users[2],
          "Skiing ticket",
          59.99,
          "2023-02-16",
          "Entertainment",
          callback
        );
      },
      function (callback) {
        billCreate(
          users[3],
          "Movie ticket",
          19.99,
          "2023-02-18",
          "Entertainment",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createPayments(cb) {
  async.parallel([
    function (callback) {
      paymentCreate(
        users[1],
        bills[1],
        34.44,
        "2023-02-07",
        "Credit Card",
        callback
      );
    },
    function (callback) {
      paymentCreate(
        users[2],
        bills[2],
        59.99,
        "2023-02-17",
        "Debit Card",
        callback
      );
    },
    function (callback) {
      paymentCreate(users[3], bills[3], 19.99, "2023-02-18", "Cash", callback);
    },
    // Optional callback
    cb,
  ]);
}

async.series(
  [createUsers, createBills, createPayments],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Payment Instances: " + payments);
    }
    // All done, disconnect from database
    // I think we might be disconnecting too early
    // cause commenting this line out allows me to finish the code
    // mongoose.connection.close();
  }
);
