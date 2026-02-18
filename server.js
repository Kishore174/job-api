const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());  // Support base64 images

const connectDB = require("./src/lib/mongodb");

connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const authRoute = require("./src/routes/authRoute");
 
 const jobRoutes = require('./src/routes/JobRoute');

 const hrRoutes = require('./src/routes/hrRoute');

 const applicationRoutes = require('./src/routes/applicationRoute');
 const landingJobRoutes = require('./src/routes/landingJobRoute');
const studentRoutes = require('./src/routes/studentRoute');
app.use('/api/student', studentRoutes);

 app.use('/api/landing-jobs', landingJobRoutes);

app.use('/api/application', applicationRoutes);

app.use('/api/hr', hrRoutes);


app.use("/api/auth", authRoute);

app.use('/api/jobs', jobRoutes);



// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
