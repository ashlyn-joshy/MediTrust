const mongoose = require('mongoose');

//models
const Appointment = require('../models/appointment');
const User = require('../models/user');
const app = require('../server');

//create new appointment
module.exports.createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, appointmentDate, status, notes, reason, createdBy } = req.body;
        //validation of patient, doctor and creator
        const patient = await User.findById(patientId);
        if (!patient || patient.role !== 'patient') {
            return res.status(400).json({ message: "Invalid patientId" });
        }
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(400).json({ message: "Invalid doctorId" });
        }
        const creator = await User.findById(createdBy);
        if (!creator) {
            return res.status(400).json({ message: "Invalid createdBy userId" });
        }
        //save appointment to db
        const newAppointment = await Appointment.create({
            patientId,
            doctorId,
            appointmentDate,
            status,
            notes,
            reason,
            createdBy
        });
        await newAppointment.save();
        res.status(201).json({ message: "Appointment created successfully" , appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: "Error in creating appointment", error: error.message });
    }
}

//get all appointments
module.exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('patientId doctorId createdBy updatedBy');
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ message: "Error in fetching appointments", error: error.message });
    }
}

//delete appointment
module.exports.deleteAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const deletedAppointment = await Appointment.findById(appointmentId);
        if (!deletedAppointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        await Appointment.findByIdAndDelete(appointmentId);
        res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error in deleting appointment", error: error.message });
    }
}