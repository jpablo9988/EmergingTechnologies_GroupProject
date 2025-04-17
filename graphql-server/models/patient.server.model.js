import mongoose from 'mongoose';
import UserModel from './user.server.model.js';
const { Schema } = mongoose;
var options = { discriminatorKey: 'type' };

const patientSchema = new Schema({
  motivationalTips: [{ type: String }],
  vitalReports: [{
    type: Schema.Types.ObjectId,
    ref: 'VitalReport',
  }],
  symptoms: [{
    type: Schema.Types.ObjectId,
    ref: 'Symptom',
  }],
  rewardPoints: {
    type: Number,
    default: 0
  }
}, options);

const PatientUser = UserModel.discriminator('Patient', patientSchema);
export default PatientUser;
