import mongoose from 'mongoose';

const docketSchema = new mongoose.Schema({
  docketNo: { type: String, required: true, unique: true },
  blastNo: { type: String, required: true },
  plant: { type: String, required: true },
  site: { type: String, required: true },
  date: { type: Date, required: true },
  
  // Status: planned, inprogress, delivered, submitted
  status: { type: String, enum: ['planned', 'inprogress', 'delivered', 'submitted'], default: 'planned' },
  
  // Vehicle & Operators
  vehicleId: { type: String, required: true },
  vehicleType: { type: String },
  operators: [{ type: String }],
  shotfirer: { type: String },
  
  // Schedule vs Actual times
  scheduledStart: { type: String },
  actualArrival: { type: String },
  
  // Customer
  customerName: { type: String },
  contractNo: { type: String },
  siteContact: { type: String },
  
  // Products
  products: [{
    matNo: String,
    name: String,
    cls: String,
    scheduledQty: Number,
    actualQty: Number,
    uom: String
  }],
  
  // Signatures
  deliveredBy: { type: String },
  receivedBy: { type: String },
  customerSigned: { type: Boolean, default: false },
  
  // Additional info (Technical, Mass, Distance)
  notes: { type: String }
}, {
  timestamps: true
});

const Docket = mongoose.model('Docket', docketSchema);

export default Docket;
