'use strict';

const express = require('express');
// const path = require('path');
const app = new express();
const ejs = require('ejs');
app.set('view engine','ejs');
app.use(express.static('public')); // used to render static files in public folder like the css, images, etc
const bodyParser = require('body-parser'); // essentials of handling form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true})); //enabling the body parser middleware so that form data can be stored in server.
// const UserModel = require('./models/UserModel');//import the BlogPost model

// creating dotenv for environment variables for DB url connection
const dotenvConfig = require('dotenv').config({ path: './DB.env' });

if (dotenvConfig.error) {
  throw dotenvConfig.error;
}


const expressSession = require('express-session'); // express session for encrypting the session Id

// controllers for different pages
const dashboardController = require('./controllers/dashboard');
const g2testController = require('./controllers/g2test');
const gtestController = require('./controllers/gtest');
const loginController = require('./controllers/login');
const signupController = require('./controllers/signup');
const getgtestformController = require('./controllers/getgtestform');
const postgtestformController = require('./controllers/postgtestform');
const postg2testformController = require('./controllers/postg2testform');
const appointmentController = require('./controllers/appointment');
const examinerController = require('./controllers/examiner');
const logoutController = require('./controllers/logout');

// middleware 
//for g2 form validation
const g2testMiddleware = require('./middleware/g2testformvalidation');
//for SignUp form validation
const signupvalidationMiddleware = require('./middleware/singupvalidation');

//for page protection with authentication of pages
const authMiddleware = require('./middleware/authmiddleware');

const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

// for appointment form validation
const formvalidationMiddleware = require('./middleware/formvalidation');

// intializing mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });


// express session for encrypting the session Id
app.use(
  expressSession({
    secret: "Prince Castelino",
    resave: false, // determines session should be saved to the session store  improve performance
    saveUninitialized: true //ensure that all sessions are saved may increase storage usage
  })
);

// creating logic for accessing page links when user has logged in 
global.loggedIn = null;
global.userType = null;
app.use("*", (req, res, next) => { //that on all requests, this middleware should be executed
  loggedIn = req.session.userId;
  userType = req.session.userType;
  next();
});


//creating page routes for each HTML page

// page route for Dashboard 
app.get('/'/*, authMiddleware*/, dashboardController);

// page route for G2 Test
app.get('/g2test', authMiddleware.authDriver, g2testController.renderG2Test);

// storing the G2 form into DB and vaildating the fields
app.post("/g2/store", g2testMiddleware, postg2testformController);

// G2 Appointment Page booking
app.get("/g2/appointmentform", formvalidationMiddleware.G2AppFormValidation, g2testController.getG2AppointmentData);

app.post("/g2/appointmentform/book",g2testController.postG2AppointmentData);

// page route for G Test
app.get('/gtest', authMiddleware.authDriver, gtestController);

// disabled coz g page will not have search license number form
// app.get('/gtestform', getgtestformController);

app.post('/gtest/carDetails', postgtestformController);

// Page route for Appointment Page
app.get('/appointment', authMiddleware.authAdmin, appointmentController.renderAppointment);

app.post('/appointmentForm/store', formvalidationMiddleware.appformValidation, appointmentController.storeAppointment);

//Page route for Examiner Page
app.get('/examiner', authMiddleware.authExaminer, examinerController.renderExaminer);

// Storing Examiner Comments and Pass Fail Status
app.post('/examiner/driver/:driverId', examinerController.storeCommentStatus);

// page route for Login
app.get('/login', redirectIfAuthenticatedMiddleware, loginController.renderLogin);

// validating the login page and navigating to dashboard or login as per validation
app.post('/loginform', redirectIfAuthenticatedMiddleware, loginController.loginUser);

// page route for SignUp
app.get('/signup', redirectIfAuthenticatedMiddleware, signupController.rendersignUp);

// validating the signup password and storing the credentials in DB
app.post("/signupform", signupvalidationMiddleware, redirectIfAuthenticatedMiddleware, signupController.postsignUp);

// rendering logout page
app.get('/auth/logout', logoutController);

// rendering the 404 page not found page Note: we have used "use" instead of get. 
//Express will go through all the routes and if it can't find one that matches, it will render the not found page
app.use((req, res) => res.render('notfound'));

app.listen(4000, ()=>{
console.log('App listening on port 4000');
});