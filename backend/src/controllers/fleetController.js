import mongoose from 'mongoose';

// @desc    Get fleet statuses
// @route   GET /api/fleetstatuses
export const getFleetStatuses = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const statuses = await db.collection('fleetstatuses').find({}).toArray();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
