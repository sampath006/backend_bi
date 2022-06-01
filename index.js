// importing required modules
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");


//getting routes

const adminRoute = require("./routes/admin")
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");

//

dotenv.config();

//Connecting mongodb
mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(console.log("Connected to MongoDB"))
.catch((err)=>console.log(err));

app.use(express.json())

// declaring routes
app.use("/api/admin",adminRoute);
app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);

app.listen("5000",()=>{
  console.log("Backend is running ...");
});

module.exports = app;