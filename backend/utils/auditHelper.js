//model
const Audit = require("../models/audit");

module.exports.createAuditLog = async ({ userId, action, entityType, entityId, change }) => {
  try {
    const auditLog = new Audit({
      userId,
      action,
      entityType,
      entityId,
      change,
    });
    await auditLog.save();
  } catch (error) {
    console.error("Error creating audit log:", error);
  }
};