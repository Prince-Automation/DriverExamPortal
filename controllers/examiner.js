const UserModel = require('../models/UserModel');
const AppointmentModel = require('../models/AppointmentModel');


const renderExaminer = async (req, res) => {
  try {
    let filter = req.query.filter;
    // console.log("Filter Value: " + filter);

    // Find appointments where isTimeSlotAvailable is false
    let appointments = await AppointmentModel.find({isTimeSlotAvailable: false}).populate("userId");

    // Filter appointments based on testType if a filter is specified - it will access the UserModel and its testType due to userId attribute.
    if (filter === "G2") {
      appointments = appointments.filter((appointment) => appointment.userId.testType === "G2");
    } else if (filter === "G") {
      appointments = appointments.filter((appointment) => appointment.userId.testType === "G");
    }

    // console.log("Appointments count after filter: " + appointments);

    // Filter appointments to include only unique userIds
    const uniqueUserIds = [
      ...new Set(appointments.map((appointment) => appointment.userId._id)),
    ];

    // console.log("Unique User Ids count: " + uniqueUserIds.length);

    // Retrieve user information for unique userIds
    const users = await UserModel.find({ _id: { $in: uniqueUserIds } });

    // console.log("Users count: " + users.length);

    // Map appointments to include required data and handle undefined properties
    appointments = appointments
      .map((appointment) => {
        const user = users.find(
          (user) => user._id.toString() === appointment.userId._id.toString()
        );
        if (!user) return null; // Skip if user not found (should not happen)

        return {
          firstName: user.firstName,
          lastName: user.lastName,
          make: user.car_details ? user.car_details.make : "N/A",
          model: user.car_details ? user.car_details.model : "N/A",
          year: user.car_details ? user.car_details.year : "N/A",
          date: appointment.date || "N/A",
          time: appointment.time || "N/A",
          type: user.testType,
          driverId: user._id,
          comments: user.comment,
          passfail: user.passFail,
        };
      })
      .filter(Boolean); // Remove null values

    // console.log("Final Appointments count: " + appointments.length);

    res.render("examiner", { appointments });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const storeCommentStatus = async (req, res) => {
  try {
    const driverId = req.params.driverId;
    const comment = req.body.comment;
    const passFail = req.body.passFail;

    // Update the driver record in your database based on the comment and passFail values
    // For example, using UserModel.findByIdAndUpdate
    await UserModel.findByIdAndUpdate(driverId, { comment, passFail });

    res.redirect('/examiner'); // Redirect to the examiner page after updating
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


// Exporting all functions
module.exports = {
  renderExaminer,
  storeCommentStatus
};
