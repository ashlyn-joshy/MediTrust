const express = require("express");
const roter = express.Router();

//controllers
const summaryController = require("../controllers/summary");

//routes
roter.post("/create", summaryController.createSummary);

module.exports = roter;