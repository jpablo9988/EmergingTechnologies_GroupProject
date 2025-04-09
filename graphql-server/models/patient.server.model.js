import mongoose from 'mongoose';
import UserModel from './user.server.model';
const { Schema } = mongoose;

const patientSchema = new Schema({
    motivationalTips: [{
        type: String
    }],
    vitalReports: [{
        type: Schema.Types.ObjectId,
        ref: 'VitalReport',
    }],
    symptoms: [{
        type: Schema.Types.ObjectId,
        ref: 'Symptom',
    }],
    emergencyAlerts:
        [{
            type: Schema.Types.ObjectId,
            ref: 'EmergencyAlert',
        }],
});
var PatientUser = UserModel.discriminator('Patient',
    patientSchema);

export default PatientUser;