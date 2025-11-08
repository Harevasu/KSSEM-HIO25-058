// Hybrid storage for metadata + logs
const mongoose = require('mongoose');
const { Pool } = require('pg');

const connectDB = async () => {
  try {
    // Connect to MongoDB for application metadata
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // PostgreSQL connection for transactional data can be configured here
    // const pool = new Pool({
    //   connectionString: process.env.POSTGRES_URI,
    // });
    // console.log('PostgreSQL connection pool created...');

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
