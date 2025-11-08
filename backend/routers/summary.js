const express = require("express");
const roter = express.Router();

//controllers
const summaryController = require("../controllers/summary");

//routes
roter.post("/create", summaryController.createSummary);
roter.get("/all", summaryController.getAllSummaries);

module.exports = roter;