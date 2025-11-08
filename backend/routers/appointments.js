const express = require("express");
const router = express.Router();

//controllers
const appointmentController = require("../controllers/appointment");

router.post("/createAppointment", appointmentController.createAppointment);
router.get("/getAllAppointments", appointmentController.getAllAppointments);
router.get("/getAppointmentsByPatient/:patientId", appointmentController.getAppointmentsByPatient);
router.delete("/deleteAppointment/:appointmentId", appointmentController.deleteAppointment);
router.put("/updateAppointment/:appointmentId", appointmentController.updateAppointment);

module.exports = router;