const express = require("express");
const router = express.Router();

//controllers
const summaryController = require("../controllers/summary");

//routes
router.post("/create", summaryController.createSummary);
router.get("/all", summaryController.getAllSummaries);
router.get("/patient/:patientId", summaryController.getSummariesByPatient);
router.get("/doctor/:doctorId", summaryController.getSummariesByDoctor);
router.delete("/delete/:summaryId", summaryController.deleteSummary);
router.put("/update/:summaryId", summaryController.updateSummary);

module.exports = router;