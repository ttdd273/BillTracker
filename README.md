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

# User Authentication

- Okay, this is something that we've never done before, so this should be interesting. Here are the steps we got from ChatGPT:

1. Choose an authentication strategy: There are different authentication strategies like username/password authentication, OAuth, JWT, etc. You should choose the strategy that best fits your use case.

2. Install necessary packages: Install the necessary packages for your chosen authentication strategy. For example, if you choose to use `passport.js` for authentication, you will need to install the passport and passport-local packages.

3. Configure authentication: Configure the authentication strategy you have chosen. For example, if you are using `passport.js` with the local strategy, you will need to set up a passport middleware with a local strategy, where you define how to authenticate a user using a username and password.

4. Create a user model: Define a user model for your web app. The user model should contain fields such as username, email, and password. You can use a database like MongoDB to store your user data.

5. Create login and registration routes: Create routes for users to log in and register. These routes should handle the authentication process, and if the authentication is successful, they should redirect the user to the appropriate page.

6. Create middleware for protected routes: You can create middleware to protect routes that require authentication. This middleware should check if the user is authenticated, and if not, redirect them to the login page.

- Overall, setting up user authentication and login in your Express Node.js web app requires a fair amount of setup, but once you have it working, it will help to keep your users' data and your web app more secure.

- So, I think the steps are pretty clear from what's explained here, but we can flush out these steps.

## Step 1.

I think what I want to do first is setting up the general routes. Thankfully, we already have our user model defined so that would save us some time.

- So, for this, I will first add the login button and redirect it to the login route.

## Step 2.

Now, we need to setup a login page, where users can enter their credentials and once the user logs on, I can create a token or a session cookie to identify the user and store it on the client-side.

- Then, we'll need to protect our routes so that only authenticated users can access them.
- This can be done by checking if the user has a valid token or session cookie before allowing them to access the protected route.

1. We will use passport to do this:

```
npm install passport passport-local passport-jwt
```

- Note that passport operates on the concept of strategies.
- Strategies can range from verifying username and password credentials, delegated authentication using OAuth (for example, via Facebook or Twitter), or federated authentication using OpenID.

- Before authenticating requests, the strategy (or strategies) used by an application must be configured.

- And:

  - `passport` is a Node.js middleware that provides an authentication framework.
  - `passport-local` is a strategy for Passport that allows users to authenticate using a username and password. It's a common way to handle login authentication for web applications.
  - `passport-jwt` is another strategy for Passport that allows users to authenticate using JSON Web Tokens (JWT). JWT is a token-based authentication mechanism that is often used in RESTful APIs. It allows for stateless authentication where the server does not need to keep track of user sessions.

- By installing both passport-local and passport-jwt, you can use both username/password and JWT authentication in your application, depending on your needs. For example, you might use JWT authentication for APIs and username/password authentication for web logins.

1. The rest of the configuration can be found in `app.js`, the login route, and the middleware that verifies the token.

```
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// configure passport to use a local strategy for authentication
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// configure passport to use a JWT strategy for authentication
passport.use(new JwtStrategy({
    secretOrKey: 'your_secret_key',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));
```

3. Login route

```
app.post('/login', passport.authenticate('local', { session: false }), async (req, res) => {
    const token = jwt.sign({ sub: req.user._id }, 'your_secret_key');
    res.json({ token });
});
```

4. Protect your routes by adding a middleware that verifies the token:

```
const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/protected-route', jwtAuth, (req, res) => {
    res.json({ message: 'This is a protected route' });
});
```

5. Note that in the process, we also realized we need a hashing function in our User mdoel that's able to tell whether or not our password is valid for the User, and in order to do that, we will need another package to decrypt and encrypt the password after hashing.

- Hashing and salting passwords:
  - Salting is the practice of adding a unique, randomly generated string of characters to a password before it is hashed.
  - The salt value is combined with the password and then hashed to create a unique hash value for each password.
  - Salting helps protect against pre-computed attacks where attackers can generate hash values for common passwords ahead of time and then quickly compare them to a stolen hash to find a match.
  - With salt added, each password has a unique hash value, even if the original passwords are the same.
  - Salting can significantly increase the complexity and time required for attackers to crack passwords.

## Step 3.

Now we want to handle authentication, this doesn't really match up with our steps from before, but this is somewhat still in order.

Here's the general process we're following:

- Retrieve the email and password from the request body.
- Find the user in the database based on the provided email.
- Compare the entered password with the stored password (using bcrypt or another password hashing library).
- If the authentication is successful, you can create a session or issue a JWT token for the user to maintain their authenticated state.

As you can see, I think the hardest or rather the most unfamiliar step will be the last step, but I think it will be an interesting thing to try out.

I see, so for authentication, and in general, it is the norm to put your middleware functions in a middleware folder, so you can acccess them relatively easily. So I will do that with the authentication middleware and put it in `auth.js`.

# Pages

- Now that we've got all the data loaded in, we will try to list out all the bills and payments first, and possibly add the functionality to create and delete bills and payments, since these are all things already covered.

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

- So for the routes, we need to add the different routes and controllers
- However, an additional step is in the `app.js` file, we need to add the router middleware information.

## /home

## /settings

## User related routes

- `GET /users/signup`: A route that renders a form for users to sign up with a new account
- `POST /users/signup`: A route that processes the form data submitted by the user to create a new account
- `GET /users/login`: A route that renders a form for users to log in with their account credentials
- `POST /users/login`: A route that processes the form data submitted by the user to authenticate their account
- `POST /users/logout`: A route that logs out the currently authenticated user
- `GET /users/:id`: A route that displays the profile information for a specific user, identified by their id parameter
- `GET /users/:id/edit`: A route that renders a form for a user to edit their own profile information
- `PUT /users/:id`: A route that processes the form data submitted by the user to update their own profile information

## Bill related routes

- `/bills`
- `/bills/:id`

## Payment related routes

- `/payments`
- `/payments/:id`
