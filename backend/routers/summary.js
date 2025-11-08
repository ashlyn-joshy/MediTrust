const express = require("express");
const roter = express.Router();

//controllers
const summaryController = require("../controllers/summary");

//routes
roter.post("/create", summaryController.createSummary);
roter.get("/all", summaryController.getAllSummaries);
roter.get("/patient/:patientId", summaryController.getSummariesByPatient);
roter.get("/doctor/:doctorId", summaryController.getSummariesByDoctor);

module.exports = roter;