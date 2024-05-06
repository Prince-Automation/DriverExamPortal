'use strict';

const UserModel = require('../models/UserModel');

module.exports = async (req, res) => {
    console.log(req.body)
    try {
        const {licenseNumber} = req.query;
        // Find user by license number
        const usermodel = await UserModel.findOne({ licenseNumber });
        if (!usermodel) {
          return res.render('gtest', { message: 'No User Found' });
      }
      res.render('gtest', { usermodel });
    } catch (err) {
        console.error('Error fetching car details:', err);
        res.status(500).send('Internal Server Error');
    }
};