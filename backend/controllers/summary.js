const mongoose = require('mongoose');

//models
const Summary = require('../models/summary');
const User = require('../models/user');

//create summary
module.exports.createSummary = async (req, res) => {
    try {
        const { patientId, doctorId, visitDate, reason, notes, createdBy } = req.body;
        //validate patient, doctor, createdBy
        const patient = await User.findById(patientId);
        if (!patient || patient.role !== 'patient') {
            return res.status(400).json({message:"Invalid patientId"});
        }
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(400).json({message:"Invalid doctorId"});
        }
        const creator = await User.findById(createdBy);
        if (!creator) {
            return res.status(400).json({message:"Invalid createdBy userId"});
        }
        //save summary to db
        const newSummary = await Summary.create({
            patientId,
            doctorId,
            visitDate,
            reason,
            notes,
            createdBy
        });
        await newSummary.save();
        res.status(201).json({message:"Summary created successfully", summary: newSummary});
    } catch (error) {
        res.status(500).json({message:"Error in creating summary", error:error.message});
    }
}