const express = require("express");
const indexRouter = require("./router/index");
const cors = require("cors");
const db=require("./config/connection");
require("dotenv").config();

const app = express();
const PORT = 13000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3002", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials if needed
  })
); 

app.use("/", indexRouter);

db.connect((err)=>{
    if(err){ 
        console.log("Database connection failed",err);
    }else{
        console.log("Database connected successfully");
    }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
