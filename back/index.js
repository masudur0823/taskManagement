const express = require("express");
const cors = require('cors')
const mongoose = require("mongoose");
const taskHanlder = require("./routehandler/taskHandler");

// express app initialization
const app = express();
app.use(express.json());

app.use(cors())

// database connection with mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/tasks")
  .then(() => console.log("database connection successfull !"))
  .catch((err) => console.log("database connection error: ", err));

// application routes
app.use("/task", taskHanlder);

// default error handler
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.listen(5000, () => console.log("app listening at port 5000"));
