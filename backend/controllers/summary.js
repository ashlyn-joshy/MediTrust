const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

//models
const Summary = require("../models/summary");
const User = require("../models/user");
const { createAuditLog } = require("../utils/auditHelper");

//create summary
module.exports.createSummary = async (req, res) => {
  try {
    const { patientId, visitDate, reason, notes } = req.body;
    //validate patient
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(400).json({ message: "Invalid patientId" });
    }
    //check if the user has doctor role
    const userRole = await User.findById(req.userId).select("role");
    if (userRole.role !== "doctor") {
      return res
        .status(403)
        .json({ message: "Only doctor can create the summary" });
    }
    //save summary to db
    const newSummary = await Summary.create({
      patientId,
      doctorId: req.userId,
      visitDate,
      reason,
      notes,
      createdBy: req.userId,
    });
    await newSummary.save();
    //log audit
    await createAuditLog({
      userId: req.userId,
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
    //checking if the user has admin role
    const userRole = await User.findById(req.userId).select("role");
    if (userRole.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can view all summaries" });
    }
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
    //checking if the user has admin or patient or doctor role
    const userRole = await User.findById(req.userId).select("role");
    if (
      userRole.role !== "admin" &&
      userRole.role !== "doctor" &&
      (userRole.role !== "patient" || req.userId.toString() !== patientId)
    ) {
      return res.status(403).json({
        message:
          "Only admin, doctor, or same the patient can view summaries for this patientId",
      });
    }
    const summaries = await Summary.find({ patientId }).populate(
      "doctorId createdBy updatedBy"
    );
    if (summaries.length === 0) {
      return res
        .status(404)
        .json({ message: "No summaries found for this patient" });
    }
    res.status(200).json({ summaries });
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching summaries for patient",
      error: error.message,
    });
  }
};

//get all summaries for a patient by pdf
module.exports.getSummariesByPatientPDF = async (req, res) => {
  try {
    const { patientId } = req.params;
    //validate patientId
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(400).json({ message: "Invalid patientId" });
    }
    //checking if the user has admin or patient or doctor role
    const userRole = await User.findById(req.userId).select("role");
    if (
      userRole.role !== "admin" &&
      userRole.role !== "doctor" &&
      (userRole.role !== "patient" || req.userId.toString() !== patientId)
    ) {
      return res.status(403).json({
        message:
          "Only admin, doctor, or same the patient can view summaries for this patientId",
      });
    }
    const summaries = await Summary.find({ patientId }).populate("doctorId");
    if (!summaries || summaries.length === 0) {
      return res
        .status(404)
        .json({ message: "No summaries found for the patient" });
    }
    //generate pdf
    const filename = `summaries_${patientId}.pdf`;
    const filePath = path.join(__dirname, "..", "temp", filename);
    if (!fs.existsSync(path.join(__dirname, "..", "temp"))) {
      fs.mkdirSync(path.join(__dirname, "..", "temp"));
    }

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc
      .fontSize(20)
      .text(`Medical Summaries for Patient: ${patient.username}`, {
        align: "center",
      });
    doc.moveDown();
    summaries.forEach((summary, index) => {
      doc
        .fontSize(14)
        .text(`Summary ${index + 1}`, { underline: true })
        .moveDown(0.5);
      doc.text(`Doctor: ${summary.doctorId?.username || "N/A"}`);
      doc.text(`Visit Date: ${summary.visitDate?.toDateString() || "N/A"}`);
      doc.text(`Reason: ${summary.reason || "N/A"}`);
      doc.text(`Notes: ${summary.notes || "N/A"}`);
      doc.moveDown();
    });
    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error("Error sending PDF:", err);
          return res.status(500).json({ message: "Error sending PDF" });
        }
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting PDF:", unlinkErr);
        });
      });
    });

    writeStream.on("error", (err) => {
      console.error("WriteStream Error:", err);
      res.status(500).json({ message: "Error writing PDF file" });
    });
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
    //checking if the user has admin or doctor role
    const userRole = await User.findById(req.userId).select("role");
    if (
      userRole.role !== "admin" &&
      (userRole.role !== "doctor" || req.userId.toString() !== doctorId)
    ) {
      return res.status(403).json({
        message: "Only admin or doctor can view all summaries by doctorId",
      });
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
    //check if user has doctor role
    const userRole = await User.findById(req.userId).select("role");
    if (
      userRole.role !== "doctor" ||
      req.userId.toString() !== deletedSummary.doctorId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Only doctor can delete the summary" });
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
    //check if the user role is doctor
    const userRole = await User.findById(req.userId).select("role");
    if (
      userRole.role !== "doctor" ||
      req.userId.toString() !== updateSummary.doctorId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Only doctor can update the summary" });
    }

    await Summary.findByIdAndUpdate(summaryId, req.body, {
      updatedBy: req.userId,
      new: true,
    });
    //log audit
    await createAuditLog({
      userId: req.userId,
      action: "update",
      entityType: "Summary",
      entityId: summaryId,
      change: { updateSummary: updateSummary },
    });
    res.status(200).json({
      message: "Summary updated successfully",
      summary: updateSummary,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in updating summary", error: error.message });
  }
};
