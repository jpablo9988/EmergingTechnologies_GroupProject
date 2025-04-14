import mongoose from 'mongoose';
const { Schema } = mongoose;

const symptomSchema = new Schema({
    // Uniques:
    name:
    {
        type: String,
        unique: true
    },
    // -------------------- //
    description:
    {
        type: String
    }
});
const SymptomModel = mongoose.model('Symptom', symptomSchema);

export default SymptomModel;