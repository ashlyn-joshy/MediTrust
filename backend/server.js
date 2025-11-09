const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

//routers
const userRouter = require("./routers/user");
const appointmentRouter = require("./routers/appointments");
const summaryRouter = require("./routers/summary");
const auditRouter = require("./routers/audit");

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
app.use("/api/audits", auditRouter);

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
