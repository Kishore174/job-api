const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());  // Support base64 images

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

 
const authRoute = require("./src/routes/authRoute");
 
 const jobRoutes = require('./src/routes/JobRoute');

 const hrRoutes = require('./src/routes/hrRoute');

 const applicationRoutes = require('./src/routes/applicationRoute');
 const landingJobRoutes = require('./src/routes/landingJobRoute');

 app.use('/api/landing-jobs', landingJobRoutes);

app.use('/api/application', applicationRoutes);

app.use('/api/hr', hrRoutes);


app.use("/api/auth", authRoute);

app.use('/api/jobs', jobRoutes);



// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
