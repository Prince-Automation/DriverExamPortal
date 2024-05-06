'use strict';

const UserModel = require('../models/UserModel');

module.exports = async (req, res) => { //we get the form data from the browser via the request body attribute seen in g2 page
    // model creates a new doc with browser data
    try {
      const { firstName, lastName, licenseNumber, age, make, model, year, plateNumber } = req.body;
      const user = await UserModel.findById(req.session.userId);
      
      user.firstName = firstName;
      user.lastName = lastName;
      user.licenseNumber = licenseNumber;
      user.age = age;
      user.car_details.make = make;
      user.car_details.model = model;
      user.car_details.year = year;
      user.car_details.plateNumber = plateNumber;
      user.testType = "G2"; // if user adds data from G2 page then testType is G2
      await user.save();
      
     /* await UserModel.create({
        firstName,
        lastName,
        licenseNumber,
        age,
        car_details: {
          make,
          model,
          year,
          plateNumber
        }
      });*/
      res.redirect("/"); // will be redirected to dashboard on click of submit button in the form
    } catch (error) {
      console.error("Error creating user data:", error);
      res.status(500).send("Error creating user data");
    }
};