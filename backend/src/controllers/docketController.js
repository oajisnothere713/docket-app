import Booking from '../models/Booking.js';

// @desc    Get all dockets for the day (Schedule)
// @route   GET /api/dockets
export const getSchedule = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    let allDockets = [];
    
    bookings.forEach(booking => {
      (booking.deliveryDockets || []).forEach(dd => {
        allDockets.push({
          _id: dd.docketNumber, 
          bookingId: booking._id,
          docketNo: dd.docketNumber,
          blastNo: booking.blastNumber,
          plant: booking.plantCode,
          site: booking.shipToSite,
          date: booking.date,
          status: (dd.status || 'Planned').toLowerCase(),
          vehicleId: dd.vehicleId || 'Unknown',
          vehicleType: 'Bulk Mix Truck',
          operators: dd.operatorIds || [],
          shotfirer: dd.shotfirerIds && dd.shotfirerIds.length > 0 ? dd.shotfirerIds[0] : 'Not assigned',
          scheduledStart: booking.startTime || '',
          customerName: booking.customerName || '',
          contractNo: booking.contractId || '',
          signature: dd.signature,
          notes: dd.notes || '',
          products: (dd.products || []).map(p => ({
            matNo: p.materialId,
            name: p.name,
            cls: p.category,
            scheduledQty: p.plannedQty,
            actualQty: p.actualQty,
            uom: p.uom
          })),
          services: (dd.services || []).map(s => ({
            matNo: s.serviceId || s.materialId || '',
            name: s.name,
            scheduledQty: s.qty !== undefined ? s.qty : s.plannedQty,
            actualQty: s.actualQty,
            uom: s.uom
          }))
        });
      });
    });
    
    res.json(allDockets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single docket details
// @route   GET /api/dockets/:id
export const getDocketById = async (req, res) => {
  // Can implement if needed, but App.jsx doesn't fetch this directly, it uses getSchedule
  res.status(404).json({ message: 'Not implemented' });
};

const mapProductsToBooking = (products) =>
  products.map(p => ({
    materialId: p.matNo || p.materialId || '',
    name: p.name || '',
    category: p.cls || p.category || 'BULK',
    plannedQty: Number(p.scheduledQty ?? p.plannedQty ?? 0),
    actualQty: Number(p.actualQty ?? 0),
    uom: p.uom || 't'
  }));

const mapServicesToBooking = (services) =>
  services.map(s => ({
    serviceId: s.matNo || s.serviceId || '',
    name: s.name || '',
    qty: Number(s.scheduledQty ?? s.qty ?? 0),
    actualQty: Number(s.actualQty ?? 0),
    uom: s.uom || 'ea'
  }));

// @desc    Submit / Update a completed docket
// @route   POST /api/dockets/:id/submit
export const submitDocket = async (req, res) => {
  try {
    const docketNo = req.params.id;
    const { actualQuantities, products, services, signature, notes } = req.body;
    
    const booking = await Booking.findOne({ 'deliveryDockets.docketNumber': docketNo });
    if (!booking) return res.status(404).json({ message: 'Docket not found' });
    
    let updated = false;
    booking.deliveryDockets.forEach(dd => {
      if (dd.docketNumber === docketNo) {
        if (signature && signature.isSigned) {
          dd.status = 'signed';
        } else {
          dd.status = 'delivered';
        }
        if (signature) dd.signature = signature;
        if (notes !== undefined) dd.notes = notes;

        if (Array.isArray(products)) {
          dd.products = mapProductsToBooking(products);
        } else if (actualQuantities && dd.products) {
          dd.products.forEach(p => {
            const key = p.materialId;
            if (key && actualQuantities[key] !== undefined) {
              p.actualQty = actualQuantities[key];
            }
          });
        }

        if (Array.isArray(services)) {
          dd.services = mapServicesToBooking(services);
        } else if (actualQuantities && dd.services) {
          dd.services.forEach(s => {
            const key = s.serviceId || s.materialId;
            if (key && actualQuantities[key] !== undefined) {
              s.actualQty = actualQuantities[key];
            }
          });
        }
        updated = true;
      }
    });
    
    if (updated) {
      await booking.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ message: 'Docket not found inside booking' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Start docket (change status from planned to inprogress)
// @route   POST /api/dockets/:id/start
export const startDocket = async (req, res) => {
  try {
    const docketNo = req.params.id;
    const booking = await Booking.findOne({ 'deliveryDockets.docketNumber': docketNo });
    if (!booking) return res.status(404).json({ message: 'Docket not found' });
    
    let updated = false;
    booking.deliveryDockets.forEach(dd => {
      if (dd.docketNumber === docketNo) {
        if ((dd.status || '').toLowerCase() === 'planned') {
          dd.status = 'inprogress';
          updated = true;
        }
      }
    });
    
    if (updated) {
      await booking.save();
      res.json({ success: true, status: 'inprogress' });
    } else {
      res.json({ success: false, message: 'Status was not planned or already updated' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

