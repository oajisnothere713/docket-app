import mongoose from 'mongoose';
import connectDB from '../config/db.js';

// @desc    Get materials catalog
// @route   GET /api/materials
export const getMaterials = async (req, res) => {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const materials = await db.collection('materials').find({}).sort({ name: 1 }).toArray();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
