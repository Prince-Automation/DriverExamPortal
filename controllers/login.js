'use strict';

const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');


// Function to render the login view
const renderLogin = (req, res) => {
    res.render('login', {error: null});
}

const loginUser = async (req, res) => {
  try {
    const { loginUsername, loginPassword } = req.body;
    if (!loginUsername || !loginPassword) {
      return res.render('login', { error: 'Username and password are required' });
    }

    const user = await UserModel.findOne({ username: loginUsername });
      if (user) {
        await bcrypt.compare(loginPassword, user.password, async (error, same) => {
          if (same) {
            // if passwords match
            // store user session
            req.session.userId = user._id; // store the user session which will be used for authentication for other pages
            req.session.userType = user.userType;
            console.log(`logged in as ${req.session.userType}`)
            res.redirect("/");
          } else {
            return res.render('login', { error: 'Incorrect password. Please try again.' });
          }
        });
      } else {
        return res.render('login', { error: 'Username not found. Please sign up.' });
      }
    
  } catch (error) {
    console.error("Error logging in:", error);
    res.redirect("/signup"); // If login is unsuccessful ask user to signup first
    // res.status(500).send("Error creating user data");
  }
};

// Exporting both functions
module.exports = {
    renderLogin,
    loginUser
};
