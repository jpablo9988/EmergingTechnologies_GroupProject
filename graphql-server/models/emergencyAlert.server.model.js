import mongoose from 'mongoose';
const { Schema } = mongoose;

const emergencyAlertSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  response: {
    type: String,
    default: '',
  },
  priority: {
    type: Number, // 1 = high, 2 = medium, 3 = low
    default: 2,
  },
  symptoms: [{
    type: Schema.Types.ObjectId,
    ref: 'Symptom',
  }]
});

const EmergencyAlertModel = mongoose.model('EmergencyAlert', emergencyAlertSchema);
export default EmergencyAlertModel;
