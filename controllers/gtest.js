"use strict";

const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  try {
    const usermodel = await UserModel.findById(req.session.userId);
    if (!usermodel) {
      return res.redirect("/");
    }

    bcrypt.compare("default", usermodel.licenseNumber, (error, result) => {
      if (error) {
        console.error("Error decrypting license number:", error);
        return res.status(500).send("Error decrypting license number");
      }

      // console.log("Prince g test:" + result.toString());

      if (result)
        // Redirecting the G2 page since license number is default and user has not added any data so redirecting to G2 Page
        return res.redirect("/g2test");
      else return res.render("gtest", { usermodel }); // since license number is not default that means there is new data and page will be shown
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).send("Error fetching user data");
  }
};

// return res.render('gtest');
//     }
//     else
//     res.redirect('/login');
