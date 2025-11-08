const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
//routers
const userRouter = require("./routers/user");
const appointmentRouter = require("./routers/appointments");
const summaryRouter = require("./routers/summary");

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!This is MediTrust Backend Server.");
});
app.use("/api/users", userRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/summaries", summaryRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
    });
});

module.exports = app;
