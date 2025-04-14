import mongoose from 'mongoose';
const { Schema } = mongoose;

const vitalReportSchema = new Schema({
    // Uniques:
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        unique: false
    },
    date: {
        type: Date,
        default: Date.now,
        unique: false
    },
    // ------------- //
    bodyTemp: {
        type: Number,
        required: 'Body Temperature is Required'
    },
    heartRate: {
        type: Number,
        required: 'Heart Rate is Required'
    },
    bloodPressure: {
        type: Number,
        required: 'Blood Pressure is Required'
    },
    respiratoryRate: {
        type: Number,
        required: 'Respiratory Rate is Required'
    },
});
//Using Compound Unique Key. (Individual uniques = false, indexed unique = true)
vitalReportSchema.index({ patient: 1, date: 1 }, { unique: true })
const VitalReportModel = mongoose.model('VitalReport', vitalReportSchema);

export default VitalReportModel;