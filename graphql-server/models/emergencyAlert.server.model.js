import mongoose from 'mongoose';
const { Schema } = mongoose;

const emergencyAlertSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const emergencyAlertModel = mongoose.model('EmergencyAlert', emergencyAlertSchema);

export default emergencyAlertModel;