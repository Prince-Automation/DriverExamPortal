'use strict';

// this is mainly for login and Singup pages, if the user has logged in then he shouldnt be able to access login/signup page
// Now when you are logged in, you will be redirected to the home page when you click on Login or SignUp.
module.exports = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect("/"); // if user logged in, redirect to home page
  }
  next();
};
