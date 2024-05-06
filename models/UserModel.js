'use strict';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// creating a schema
const UserModelSchema = new Schema({
  firstName: { type: String, default: "default" },
  lastName: { type: String, default: "default" },
  licenseNumber: { type: String, default: "default" },
  age: { type: Number, default: 0 },
  username: { type: String, unique: true }, //unique: true
  password: { type: String }, //Encrypted value
  userType: { type: String },
  testType: { type: String, default: "default" },
  comment: { type: String },
  passFail: { type: String },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
  car_details: {
    make: { type: String, default: "default" },
    model: { type: String, default: "default" },
    year: { type: Number, default: "0" },
    plateNumber: { type: String, default: "default" },
  },
});

// executing the encryption before saving the any record
// UserModelSchema.pre("save", function (next) {
//   const user = this;

//   if (!user.isNew) {
//     return next(); // Skip encryption if the document is not new and the licenseNumber is not modified
//   } else {
//     bcrypt.hash(user.password, 10, (error, passwordHash) => {
//       if (error) return next(error);
//       user.password = passwordHash;
//       next();
//     });
//   }

//   if (!user.isModified("licenseNumber")) 
//   return next();
//   else {
//     bcrypt.hash(user.licenseNumber, 10, (error, licenseNumberHash) => {
//       if (error) return next(error);
//       user.licenseNumber = licenseNumberHash;
//     });
//   }
// });

UserModelSchema.pre("save", function (next) {
  const user = this;

  // Encrypt password if it is new or modified
  if (user.isModified("password")) {
    bcrypt.hash(user.password, 10, (error, passwordHash) => {
      if (error) return next(error);
      user.password = passwordHash;
      next();
    });
  } else {
    // Skip encryption for password if it is not modified
    next();
  }
});

UserModelSchema.pre("save", function (next) {
  const user = this;

  // Encrypt licenseNumber if it is new or modified
  if (user.isNew || user.isModified("licenseNumber")) {
    bcrypt.hash(user.licenseNumber, 10, (error, licenseNumberHash) => {
      if (error) return next(error);
      user.licenseNumber = licenseNumberHash;
      next();
    });
  } else {
    // Skip encryption for licenseNumber if it is not modified
    next();
  }
});

const UserModel = mongoose.model("UserModel", UserModelSchema); // creating a mongoose model "UserModel" based on the "UserModelSchema"
module.exports = UserModel;