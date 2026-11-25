import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import docketRoutes from './routes/docketRoutes.js';
import fleetRoutes from './routes/fleetRoutes.js';
import materialRoutes from './routes/materialRoutes.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure database connection is ready before handling API requests (important for serverless cold starts)
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Routes
app.use('/api/dockets', docketRoutes);
app.use('/api/fleetstatuses', fleetRoutes);
app.use('/api/materials', materialRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Docket API is running...');
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(() => process.exit(1));
}

export default app;
