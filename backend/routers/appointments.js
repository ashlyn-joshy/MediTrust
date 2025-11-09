const express = require("express");
const router = express.Router();

//controllers
const appointmentController = require("../controllers/appointment");
//Authenticate
const requireAuth = require("../middleware/authMiddleware");

router.post(
  "/createAppointment",
  requireAuth,
  appointmentController.createAppointment
);
router.get(
  "/getAllAppointments",
  requireAuth,
  appointmentController.getAllAppointments
);
router.get(
  "/getAppointmentsByPatient/:patientId",
  requireAuth,
  appointmentController.getAppointmentsByPatient
);
router.get(
  "/getAppointmentsByDoctor/:doctorId",
  requireAuth,
  appointmentController.getAppointmentsByDoctor
);
router.delete(
  "/deleteAppointment/:appointmentId",
  requireAuth,
  appointmentController.deleteAppointment
);
router.put(
  "/updateAppointment/:appointmentId",
  requireAuth,
  appointmentController.updateAppointment
);

module.exports = router;