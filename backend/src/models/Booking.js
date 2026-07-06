import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  materialId: String,
  name: String,
  category: String,
  plannedQty: Number,
  actualQty: Number,
  uom: String
}, { _id: false });

const deliveryDocketSchema = new mongoose.Schema({
  docketNumber: String,
  status: { type: String, default: 'Planned' },
  vehicleId: String,
  operatorIds: [String],
  shotfirerIds: [String],
  products: [productSchema],
  signature: {
    isSigned: Boolean,
    signedBy: String
  }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  _id: String,
  blastNumber: String,
  plantCode: String,
  date: String,
  startTime: String,
  bookingType: String,
  customerName: String,
  shipToSite: String,
  deliveryDockets: [deliveryDocketSchema]
}, {
  timestamps: true,
  collection: 'bookings' // Explicitly point to the bookings collection
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
