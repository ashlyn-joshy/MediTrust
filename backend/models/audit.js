const mongoose = require("mongoose");
const { Schema } = mongoose;

const auditSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: Schema.Types.ObjectId },
  timestamp: { type: Date, default: Date.now },
  change: { type: Object },
});

module.exports = mongoose.model("Audit", auditSchema);
