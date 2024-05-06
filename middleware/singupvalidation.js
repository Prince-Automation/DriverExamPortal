'use strict';

const UserModel = require('../models/UserModel');

//validating the form data in G2 test page on server side
module.exports = (req, res, next) => {
    const { username, password, repeatPassword, userType } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for validating email addresses

    const errors = [];
    
    if (!username || !password || !repeatPassword || !userType) {
        // return res.status(400).send('All fields are required');
        errors.push('All fields are required');
    }

    else if (!emailRegex.test(username)) {
        // return res.status(400).send('Invalid email address');
        errors.push('Invalid email address');
    }

    // creating validation for pass and repeat pass
    else if(password!==repeatPassword)
    // return res.status(400).send('Password and Repeat Password are not matching');
    errors.push('Password and Repeat Password are not matching');

    if (errors.length > 0) {
        return res.render('signup', { error: errors.join(', ') });
    }
    
  
    // If all validations pass, continue to the next middleware
    next();
};