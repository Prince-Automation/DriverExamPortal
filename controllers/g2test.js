'use strict';

const UserModel = require('../models/UserModel');
const AppointmentModel = require('../models/AppointmentModel');
const bcrypt = require('bcrypt');

const renderG2Test = async (req,res)=>{
  try {
      const user = await UserModel.findById(req.session.userId);
      if (!user) {
        return res.redirect("/");
      }

      bcrypt.compare("default", user.licenseNumber, (error, result) => {
        if (error) {
          console.error("Error decrypting license number:", error);
          return res.status(500).send("Error decrypting license number");
        }

        // console.log("Prince g2 test:" + result.toString());

        // Render the G2 page
        return res.render("g2test", { user, result, appointments: null, successMsg: null, appointmentBookedByUser: null});
      });
  }
  catch(err)
  {
    console.error("Error fetching user data:", err);
    res.status(500).send("Error fetching user data");
  }
};

const getG2AppointmentData = async (req,res)=>{
  try {

    const { bookingdate } = req.query;
    
    const appointments = await AppointmentModel.find({ date: bookingdate, isTimeSlotAvailable: true }); // taking only those slots that are isTimeSlotAvailable true

    const appointmentBookedByUser = await AppointmentModel.find({
      userId: req.session.userId,
      date: bookingdate,
      isTimeSlotAvailable: false,
    });

    const user = await UserModel.findById(req.session.userId);
      if (!user) {
        return res.redirect("/");
      }

      bcrypt.compare("default", user.licenseNumber, (error, result) => {
        if (error) {
          console.error("Error decrypting license number:", error);
          return res.status(500).send("Error decrypting license number");
        }

        // console.log("Prince g2 test:" + result.toString());
        
        // Render the G2 page
        return res.render("g2test", { user, result, appointments, successMsg: null, appointmentBookedByUser}); 
      });
} catch (error) {
    console.error("Error fetching appointment data:", error);
    res.status(500).send("Error fetching appointment data");
}

};


const postG2AppointmentData = async (req,res)=>{
  try {

    const { bookingdate, time } = req.body;
    
    // const bookappointments = await AppointmentModel.findByIdAndUpdate(time, { isTimeSlotAvailable: false }); //time variable contains the document ID
    const bookappointments = await AppointmentModel.findByIdAndUpdate(
      time,
      { isTimeSlotAvailable: false, userId: req.session.userId },
      { new: true } // To return the updated document
    );


    if (!bookappointments) {
      return res.status(404).send("Appointment not found");
    }

    const appointmentBookedByUser = await AppointmentModel.find({
      userId: req.session.userId,
      date: bookingdate,
      isTimeSlotAvailable: false,
    });

    const appointments = await AppointmentModel.find({ date: bookingdate, isTimeSlotAvailable: true }); // taking only those slots that are isTimeSlotAvailable true

    const user = await UserModel.findById(req.session.userId);
      if (!user) {
        return res.redirect("/");
      }

      bcrypt.compare("default", user.licenseNumber, (error, result) => {
        if (error) {
          console.error("Error decrypting license number:", error);
          return res.status(500).send("Error decrypting license number");
        }

        // console.log("Prince g2 test:" + result.toString());
        
        // Render the G2 page
        return res.render("g2test", { user, result, appointments, successMsg: "Appointment booked successfully",appointmentBookedByUser});
      });
    // return res.redirect("/gtest");
} catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).send("Error booking appointment");
}

};


module.exports = {
  renderG2Test,
  getG2AppointmentData,
  postG2AppointmentData
};