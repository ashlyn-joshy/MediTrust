const express = require("express");
const router = express.Router();

//controllers
const appointmentController = require("../controllers/appointment");

router.post("/createAppointment", appointmentController.createAppointment);

module.exports = router;