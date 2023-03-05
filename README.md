# BillTracker

- This is a personal project to allow users to track their payments, from which they can connect to others online.

- Remember that to implement the pages and routes, we are using a Model View Controller model.

- Where the controller gets us the data
- The view displays the data
- The model describes the data and connects to the database

# Sprints

## Sprint 1: Basic Functionality

    - Set up the project and create a basic layout
    - Create a user registration and login system
    - Allow users to add, edit, and delete bills
    - Allow users to view a list of their bills

## Sprint 2: Payment Tracking

    - Allow users to add, edit, and delete payments
    - Create a page to track payments for each bill
    - Allow users to view a list of their payments

## Sprint 3: Advanced Functionality

    - Allow users to set reminders for bill due dates
    - Create a dashboard to display a summary of bills and payments
    - Add functionality to sort and filter bills and payments
    - Allow users to upload and store receipts for payments

## Sprint 4: User Experience Improvements

    - Implement a responsive design for mobile devices
    - Add error handling and form validation
    - Implement password reset functionality
    - Improve the UI/UX design to enhance user experience

## Sprint 5: Additional Features

    - Implement an analytics dashboard to display insights and trends
    - Allow users to share bill and payment information with others
    - Add support for multiple currencies and languages
    - Implement a budgeting feature to track spending and saving goals

# Models

- The first step will be setting up the models for the bills and payments.

- We will need to think about what attributes should be included, what should be the keys, etc.

- This is also where we will be connecting to MongoDB and setting up the database for the first time.

- Just for now, we will use a basic setup with the following collections inside the databse:

1. Users Collection:

   - \_id (unique identifier)
   - name (user's full name)
   - email (user's email address)
   - password (encrypted password)

2. Bills Collection:

   - \_id (unique identifier)
   - userId (the id of the user who owns the bill)
   - name (name of the bill)
   - amount (the amount owed)
   - dueDate (the date the bill is due)
   - category (the type of bill, e.g. rent, utilities, etc.)
   - reminders (an array of dates when the user wants to be reminded about the bill)

3. Payments Collection:
   - \_id (unique identifier)
   - userId (the id of the user who made the payment)
   - billId (the id of the bill that the payment was made for)
   - amount (the amount of the payment)
   - date (the date the payment was made)
   - paymentMethod (the method of payment, e.g. credit card, bank transfer, etc.)
   - receipt (a file or URL linking to the payment receipt)

# Pages

## Homepage

- Displays an overview of the user's bills and payments

## Login page

- Allows users to sign in to their account

## Registration page

- Allows new users to create an account

## Dashboard

- Displays a summary of the user's bills and payments, as well as options to add, edit, or delete bills and payments

## Bills page

- Lists all the bills that the user has to pay, with options to add, edit, or delete bills

## Bill details page

- Shows the details of a specific bill, including the due date, amount, and payment history

## Payments page

- Lists all the payments the user has made, with options to add, edit, or delete payments

## Payment details page

- Shows the details of a specific payment, including the payment amount and date

## Settings page

- Allows the user to update their account settings and preferences, such as their name, email, and password.

# Routes

## /home

## /login

## /register

## dashboard

## /bills

## /bills/:id

## /payments

## /payments/:id

## / settings
