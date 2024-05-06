'use strict';

const UserModel = require('../models/UserModel');

const rendersignUp = (req,res)=>{
    res.render('signup', { error: null });
}

// function to store SignUp in DB
const postsignUp = async (req, res) => {
  try {
    const { username, password, userType } = req.body;

    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.render("signup", { error: "Username already exists" });
    } 
    else {
      await UserModel.create({
        username,
        password,
        userType,
      });
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error creating user data:", error);
    res.status(500).send("Error creating user data");
  }
};

// Exporting both functions
module.exports = {
    rendersignUp,
    postsignUp
};