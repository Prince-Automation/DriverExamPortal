'use strict';


const UserModel = require('../models/UserModel');
const AppointmentModel = require('../models/AppointmentModel');

const renderAppointment = async (req,res)=>{ 
      return res.render("appointment", { error: null, successmsg: null });
}

const storeAppointment = async (req, res) => {
  try {
      const { date, time } = req.body;

      // Split the time string by commas to get individual time slots
      const timeSlots = time.split(',');

      // Check if any of the time slots already exist in the database
      const existingAppointments = await AppointmentModel.find({ date, time: { $in: timeSlots } }); //$in operator is used to specify a condition where the value of a field must match any of the values specified in an array.

      if (existingAppointments.length > 0) {
        // If any time slots already exist, construct a list of existing timeslots
        const existingTimeSlots = existingAppointments.map(appointment => appointment.time);

        // Render the appointment page with an error message and the list of existing timeslots
        return res.render("appointment", { error: "One or more time slots already exist. Please retry with correct TimeSlots", existingTimeSlots , successmsg: null });
      }

        // Iterate over the time slots and create a document for each
      for (const timeSlot of timeSlots) {
        // Create the appointment
        await AppointmentModel.create({
          date,
          time: timeSlot.trim(), // Remove leading/trailing spaces
          isTimeSlotAvailable: true
        });
      }

        // Redirect with a success message
        res.render("appointment",{error: null,successmsg:"Data Stored Successfully"});
  } catch (error) {
      console.error("Error creating appointment data:", error);
      res.status(500).send("Error creating appointment data");
  }
};

// Helper function to format date if needed
// function formatDate(dateString) {
//     // Add your date formatting logic here
//     return formattedDate;
// }


// Exporting both functions
module.exports = {
      renderAppointment,
      storeAppointment
  };