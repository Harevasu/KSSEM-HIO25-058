// "Populates NAD-like registry"
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// This would be a model for trusted issuers, for now just a placeholder
// const TrustedIssuer = require('../backend/models/TrustedIssuer');

dotenv.config({ path: '../backend/.env' });

const issuers = [
  {
    name: "Saveetha Engineering College",
    ugc_recognized": true,
    "nad_eligible": true,
    "website": "https://www.saveetha.ac.in"
  },
  {
    name: "Anna University",
    "ugc_recognized": true,
    "nad_eligible": true,
    "website": "https://www.annauniv.edu"
  }
];

const seedDB = async () => {
  // await connectDB();
  // await TrustedIssuer.deleteMany({});
  // await TrustedIssuer.insertMany(issuers);
  console.log('Database seeded! (simulation)');
  // mongoose.connection.close();
};

seedDB();
