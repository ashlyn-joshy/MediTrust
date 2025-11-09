const express = require("express");
const router = express.Router();

//controllers
const summaryController = require("../controllers/summary");
//Authenticate
const requireAuth = require("../middleware/authMiddleware");

//routes
router.post("/create", requireAuth, summaryController.createSummary);
router.get("/all", requireAuth, summaryController.getAllSummaries);
router.get(
  "/patient/:patientId",
  requireAuth,
  summaryController.getSummariesByPatient
);
router.get(
  "/patient/:patientId/pdf",
  requireAuth,
  summaryController.getSummariesByPatientPDF
);
router.get(
  "/doctor/:doctorId",
  requireAuth,
  summaryController.getSummariesByDoctor
);
router.delete(
  "/delete/:summaryId",
  requireAuth,
  summaryController.deleteSummary
);
router.put("/update/:summaryId", requireAuth, summaryController.updateSummary);

module.exports = router;
