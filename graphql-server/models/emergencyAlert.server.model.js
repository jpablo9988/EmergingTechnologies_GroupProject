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

const EmergencyAlertModel = mongoose.model('EmergencyAlert', emergencyAlertSchema);

export default EmergencyAlertModel;