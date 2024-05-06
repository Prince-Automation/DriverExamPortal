'use strict';

//validating the form data in G2 test page on server side
module.exports = (req, res, next) => {
    const { firstName, lastName, licenseNumber, age, make, model, year, plateNumber } = req.body;
    if (!firstName || !lastName || !licenseNumber || !age || !make || !model || !year || !plateNumber) {
        return res.status(400).send('All fields are required');
    }
  
    // If all validations pass, continue to the next middleware
    next();
};