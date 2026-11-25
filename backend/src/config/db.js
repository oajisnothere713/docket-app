import mongoose from 'mongoose';

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error(`Error connecting to MongoDB: ${error.message}`);
        throw error;
      });
  }

  return connectionPromise;
};

export default connectDB;
