const express = require("express");
const router = express.Router();

//controllers
const auditController = require("../controllers/audit");

//routes
router.get("/all", auditController.getAllAudits);

module.exports = router;