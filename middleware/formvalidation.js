'use strict';

const AppointmentModel = require('../models/AppointmentModel');

//validating the form data in appointment page on server side
const appformValidation = async (req, res, next) => {
    const { date, time } = req.body;

    const errors = [];

    if (!date || !time) {
        // return res.status(400).send('All fields are required');
        errors.push('All fields are required');
    }
    

    if (errors.length > 0) {
        return res.render('appointment', { error: errors.join(', ') , existingTimeSlots: null, successmsg: null });
    }
    
  
    // If all validations pass, continue to the next middleware
    next();
};

const G2AppFormValidation = async (req, res, next) => {
    const {bookingdate} = req.query;

    if (!bookingdate) {
        return res.status(400).send('Date field is required');
        // return alert("Date field is required");
    }

    // If all validations pass, continue to the next middleware
    next();
};

module.exports = {
    appformValidation,
    G2AppFormValidation
};