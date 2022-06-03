// importing required modules
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");


const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs'); 
const swaggerDocument = YAML.load('./swagger/swagger.yaml');
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const eventRoute = require("./routes/Events")
const commentRoute = require("./routes/Comment")


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
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);
app.use("/api/categories",categoryRoute);
app.use("/api/events",eventRoute);
app.use("/api/comments",commentRoute);
const port = 5000;

app.listen(process.env.PORT || port,()=>{
  console.log(`Backend is running ...${port}`);
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
)


module.exports = app;