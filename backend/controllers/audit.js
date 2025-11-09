//models
const Audit = require("../models/audit");

module.exports.getAllAudits = async (req, res) => {
  try {
    const audits = await Audit.find().populate("userId");
    res.status(200).json({ audits });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching audit logs",
      error: error.message,
    });
  }
};