const express = require("express");
const router = express.Router();

//controllers
const auditController = require("../controllers/audit");
//Authenticate
const requireAuth = require("../middleware/authMiddleware");

//routes
router.get("/all", requireAuth, auditController.getAllAudits);

module.exports = router;
