'use strict';

const UserModel = require('../models/UserModel');

const authDriver = async (req, res, next) => {
    try{
    const user = await UserModel.findById(req.session.userId);
    if (!user) 
    return res.redirect("/"); // for temp im redirecting to signup or dashboard
    
    // protecting access of page even with direct URL i.e if user adds the URL directly 
    // they will still not be able to render the page due to userType
    if (user.userType === "Driver") { 
        next(); // Proceed to the next middleware or route handler
    } else {
        return res.redirect("/"); // Redirect to home for unauthorized users
    }
}
catch (err){
    console.log("error seen in auth middleware: ",err);
    res.redirect("/");  // for temp im redirecting to signup or dashboard
}
};

const authAdmin = async (req, res, next) => {
    try{
    const user = await UserModel.findById(req.session.userId);
    if (!user) 
    return res.redirect("/"); // for temp im redirecting to signup or dashboard
    
    // protecting access of page even with direct URL i.e if user adds the URL directly 
    // they will still not be able to render the page due to userType
    if (user.userType === "Admin") { 
        next(); // Proceed to the next middleware or route handler
    } else {
        return res.redirect("/"); // Redirect to home for unauthorized users
    }
}
catch (err){
    console.log("error seen in auth middleware: ",err);
    res.redirect("/");  // for temp im redirecting to signup or dashboard
}
};

const authExaminer = async (req, res, next) => {
    try{
    const user = await UserModel.findById(req.session.userId);
    if (!user) 
    return res.redirect("/"); // for temp im redirecting to signup or dashboard
    
    // protecting access of page even with direct URL i.e if user adds the URL directly 
    // they will still not be able to render the page due to userType
    if (user.userType === "Examiner") { 
        next(); // Proceed to the next middleware or route handler
    } else {
        return res.redirect("/"); // Redirect to home for unauthorized users
    }
}
catch (err){
    console.log("error seen in auth middleware: ",err);
    res.redirect("/");  // for temp im redirecting to signup or dashboard
}
};

// Exporting both functions
module.exports = {
    authDriver,
    authAdmin,
    authExaminer
};