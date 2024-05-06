'use strict';

const UserModel = require('../models/UserModel');

module.exports = async (req, res) => {
    try {
        const { licenseNumber, make, model, year, plateNumber } = req.body;
        
        // Find the user by their license number
        const user = await UserModel.findOne({ licenseNumber });
        if (!user) {
            return res.status(404).send('No User Found');
        }
        // Update the user's car details
        user.car_details.make = make;
        user.car_details.model = model;
        user.car_details.year = year;
        user.car_details.plateNumber = plateNumber;
        user.testType = "G";
        // Save the changes to the database
        await user.save();
        // Redirect the user back to the G_page or any other appropriate page
        res.redirect('/gtest');
    } catch (err) {
        console.error('Error updating car details:', err);
        res.status(500).send('Internal Server Error');
    }
}