const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  date: { type: String},
  time: String,
  isTimeSlotAvailable: Boolean,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
