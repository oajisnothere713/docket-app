import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Docket from './models/Docket.js';
import connectDB from './config/db.js';

dotenv.config({ path: '../.env' }); // Since it might run from src/

const seedDockets = async () => {
  await connectDB();

  await Docket.deleteMany(); // Clear existing

  const dockets = [
    {
      docketNo: 'DD-94021',
      blastNo: 'BL-2026-041',
      plant: '1054 — Panna',
      site: 'Panna Pit A',
      date: new Date('2026-06-30T00:00:00Z'),
      status: 'inprogress',
      vehicleId: 'MH-12-BMD-01',
      vehicleType: 'Bulk Mix Truck',
      operators: ['Ramesh Patil', 'Anil More'],
      shotfirer: 'Mahesh Verma',
      scheduledStart: '06:30',
      actualArrival: '06:32',
      customerName: 'JK Cement Works — Central',
      contractNo: 'C-JKC-24-0117',
      siteContact: 'Arjun Singh',
      products: [
        { matNo: 'MAT-8001', name: 'Ammonium Nitrate Porous Prill', cls: 'BULK', scheduledQty: 14000, actualQty: 14000, uom: 'KG' },
        { matNo: 'MAT-2104', name: 'Non-Electric Detonator 500ms', cls: 'ISPE', scheduledQty: 120, actualQty: 120, uom: 'EA' }
      ]
    },
    {
      docketNo: 'DD-94022',
      blastNo: 'BL-2026-042',
      plant: '1054 — Panna',
      site: 'Panna Pit B',
      date: new Date('2026-06-30T00:00:00Z'),
      status: 'planned',
      vehicleId: 'MH-12-BMD-01',
      vehicleType: 'Bulk Mix Truck',
      operators: ['Ramesh Patil', 'Anil More'],
      shotfirer: 'Sanjay Mishra',
      scheduledStart: '11:15',
      customerName: 'JK Cement Works — Central',
      contractNo: 'C-JKC-24-0117',
      siteContact: 'Vikram Joshi',
      products: [
        { matNo: 'MAT-8001', name: 'Ammonium Nitrate Porous Prill', cls: 'BULK', scheduledQty: 12000, actualQty: null, uom: 'KG' }
      ]
    }
  ];

  await Docket.insertMany(dockets);
  console.log('Database Seeded!');
  process.exit();
};

seedDockets();
