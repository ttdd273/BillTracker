// Middleware function to check if the user is authenticated
const authenticateUser = (req, res, next) => {
  // Check if the user is authenticated
  if (req.isAuthenticated()) {
    // User is authenticated, proceed to the next middleware or route handler
    return next();
  }

  // User is not authenticated, redirect them to the login page or show an error message
  res.redirect("/login");
};

// Export the middleware function
module.exports = authenticateUser;
