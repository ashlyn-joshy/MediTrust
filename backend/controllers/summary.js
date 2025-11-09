const mongoose = require("mongoose");

//models
const Summary = require("../models/summary");
const User = require("../models/user");
const { createAuditLog } = require("../utils/auditHelper");

//create summary
module.exports.createSummary = async (req, res) => {
  try {
    const { patientId, doctorId, visitDate, reason, notes, createdBy } =
      req.body;
    //validate patient, doctor, createdBy
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(400).json({ message: "Invalid patientId" });
    }
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ message: "Invalid doctorId" });
    }
    const creator = await User.findById(createdBy);
    if (!creator) {
      return res.status(400).json({ message: "Invalid createdBy userId" });
    }
    //save summary to db
    const newSummary = await Summary.create({
      patientId,
      doctorId,
      visitDate,
      reason,
      notes,
      createdBy,
    });
    await newSummary.save();
    //log audit
    await createAuditLog({
      userId: createdBy,
      action: "create",
      entityType: "Summary",
      entityId: newSummary._id,
      change: { createdSummary: newSummary },
    });
    res
      .status(201)
      .json({ message: "Summary created successfully", summary: newSummary });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in creating summary", error: error.message });
  }
};

//get all summaries
module.exports.getAllSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find().populate(
      "patientId doctorId createdBy updatedBy"
    );
    res.status(200).json({ summaries });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in fetching summaries", error: error.message });
  }
};

//get all summaries for a patient
module.exports.getSummariesByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    //validate patientId
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(400).json({ message: "Invalid patientId" });
    }
    const summaries = await Summary.find({ patientId }).populate(
      "doctorId createdBy updatedBy"
    );
    res.status(200).json({ summaries });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching summaries for patient",
      error: error.message,
    });
  }
};

//get all summaries by doctor
module.exports.getSummariesByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    //validate doctorId
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ message: "Invalid doctorId" });
    }
    const summaries = await Summary.find({ doctorId }).populate(
      "patientId createdBy updatedBy"
    );
    res.status(200).json({ summaries });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching summaries for doctor",
      error: error.message,
    });
  }
};

//delete summary
module.exports.deleteSummary = async (req, res) => {
  try {
    const { summaryId } = req.params;
    const deletedSummary = await Summary.findById(summaryId);
    if (!deletedSummary) {
      return res.status(404).json({ message: "Summary not found" });
    }
    await Summary.findByIdAndDelete(summaryId);
    //log audit
    await createAuditLog({
      userId: req.userId,
      action: "delete",
      entityType: "Summary",
      entityId: summaryId,
      change: { deletedSummary: deletedSummary },
    });
    res.status(200).json({ message: "Summary deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in deleting summary", error: error.message });
  }
};

//update summary
module.exports.updateSummary = async (req, res) => {
  try {
    const { summaryId } = req.params;
    const updateSummary = await Summary.findById(summaryId);
    if (!updateSummary) {
      return res.status(404).json({ message: "Summary not found" });
    }
    //validation of patient, doctor and updater
    const patient = await User.findById(req.body.patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(400).json({ message: "Invalid patientId" });
    }
    const doctor = await User.findById(req.body.doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ message: "Invalid doctorId" });
    }
    const updater = await User.findById(req.body.updatedBy);
    if (!updater) {
      return res.status(400).json({ message: "Invalid updatedBy userId" });
    }
    await Summary.findByIdAndUpdate(summaryId, req.body, { new: true });
    //log audit
    await createAuditLog({
      userId: req.body.updatedBy,
      action: "update",
      entityType: "Summary",
      entityId: summaryId,
      change: { updateSummary: updateSummary },
    });
    res
      .status(200)
      .json({
        message: "Summary updated successfully",
        summary: updateSummary,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in updating summary", error: error.message });
  }
};
