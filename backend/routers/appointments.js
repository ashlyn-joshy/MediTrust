const express = require("express");
const router = express.Router();

//controllers
const appointmentController = require("../controllers/appointment");

router.post("/createAppointment", appointmentController.createAppointment);
router.get("/getAllAppointments", appointmentController.getAllAppointments);

module.exports = router;