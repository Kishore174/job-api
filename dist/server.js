"use strict";

var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
var dotenv = require("dotenv");
dotenv.config();
var bodyParser = require('body-parser');
var app = express();
app.use(cors());
app.use(bodyParser.json()); // Support base64 images

var connectDB = require("./src/lib/mongodb");
connectDB().then(function () {
  return console.log("MongoDB Connected");
})["catch"](function (err) {
  return console.log(err);
});
var authRoute = require("./src/routes/authRoute");
var jobRoutes = require('./src/routes/JobRoute');
var hrRoutes = require('./src/routes/hrRoute');
var applicationRoutes = require('./src/routes/applicationRoute');
var landingJobRoutes = require('./src/routes/landingJobRoute');
var studentRoutes = require('./src/routes/studentRoute');
app.use('/api/student', studentRoutes);
app.use('/api/landing-jobs', landingJobRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/hr', hrRoutes);
app.use("/api/auth", authRoute);
app.use('/api/jobs', jobRoutes);

// Server
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  return console.log("Server running on port ".concat(PORT));
});