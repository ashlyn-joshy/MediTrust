//models
const Audit = require("../models/audit");
const User = require("../models/user");

module.exports.getAllAudits = async (req, res) => {
  try {
    //checking if the user has admin role
    const userRole = await User.findById(req.userId).select("role");
    if (userRole.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can view audit logs" });
    }
    const audits = await Audit.find().populate("userId");
    res.status(200).json({ audits });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching audit logs",
      error: error.message,
    });
  }
};
