import mongoose from 'mongoose';
import config from './config.js';
import '../models/emergencyAlert.server.model.js';
import '../models/user.server.model.js';
import '../models/symptom.server.model.js';
import '../models/vitalReport.server.model.js'
//Unsure if you should load these like regular models. Beware!
import '../models/nurse.server.model.js'
import '../models/patient.server.model.js'


// Define the Mongoose configuration method
const connectToDatabase = async () => {
  try {
    const db = await mongoose.connect(config.db);
    console.log('DB Connected!', config.db);
    return db;
  } catch (err) {
    console.error('Error in DB connection', err);
    throw err;
  }
};

export default connectToDatabase;
