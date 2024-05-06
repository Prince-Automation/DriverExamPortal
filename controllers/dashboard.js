'use strict';

module.exports = (req,res)=>{ 
    // console.log(`userType: ${req.session.userType}`); // to check the cookie data when we navigate to the dashboard page
    //if (req.session.userId) { //if user id exists then this pages can be accessed which happens when we have the correct login ID
        return res.render("index");
      // } 
      // else res.redirect("/login");
}