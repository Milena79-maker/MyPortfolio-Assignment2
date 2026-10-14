import Qualification from "../models/qualification.model.js";

// GET all qualifications
export const getQualifications = async (req, res) => {
  try {
    const qualifications = await Qualification.find();
    res.status(200).json(qualifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET qualification by ID
export const getQualification = async (req, res) => {
  try {
    const qualification = await Qualification.findById(req.params.id);
    if (!qualification) {
      return res.status(404).json({ message: "Qualification not found" });
    }
    res.status(200).json(qualification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST create qualification
export const createQualification = async (req, res) => {
  try {
    const qualification = await Qualification.create(req.body);
    res.status(201).json(qualification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update qualification
export const updateQualification = async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!qualification) {
      return res.status(404).json({ message: "Qualification not found" });
    }
    res.status(200).json(qualification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE qualification
export const deleteQualification = async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndDelete(req.params.id);
    if (!qualification) {
      return res.status(404).json({ message: "Qualification not found" });
    }
    res.status(200).json({ message: "Qualification deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};