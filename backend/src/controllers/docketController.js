import Docket from '../models/Docket.js';

// @desc    Get all dockets for the day (Schedule)
// @route   GET /api/dockets
export const getSchedule = async (req, res) => {
  try {
    const dockets = await Docket.find({}).sort({ scheduledStart: 1 });
    res.json(dockets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single docket details
// @route   GET /api/dockets/:id
export const getDocketById = async (req, res) => {
  try {
    const docket = await Docket.findById(req.params.id);
    if (docket) {
      res.json(docket);
    } else {
      res.status(404).json({ message: 'Docket not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit / Update a completed docket
// @route   POST /api/dockets/:id/submit
export const submitDocket = async (req, res) => {
  try {
    const { actualArrival, notes, receivedBy, customerSigned, products } = req.body;
    
    const docket = await Docket.findById(req.params.id);

    if (docket) {
      docket.actualArrival = actualArrival || docket.actualArrival;
      docket.notes = notes || docket.notes;
      docket.receivedBy = receivedBy || docket.receivedBy;
      docket.customerSigned = customerSigned || docket.customerSigned;
      
      // Update actual product quantities if provided
      if (products && products.length > 0) {
        docket.products = products;
      }
      
      docket.status = 'submitted';

      const updatedDocket = await docket.save();
      res.json(updatedDocket);
    } else {
      res.status(404).json({ message: 'Docket not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
