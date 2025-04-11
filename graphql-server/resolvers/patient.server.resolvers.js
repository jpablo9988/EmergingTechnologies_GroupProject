// patient.resolvers.js
import PatientUser from '../models/patient.server.model.js';
import SymptomModel from '../models/symptom.server.model.js';
//This only has specific funcions to Patient. Remember that this is a child of user.
//Patients can use all functions definded in user resolver.
const PatientResolvers = {
  Query: {
    patients: async () => await PatientUser.find(),
    patient: async (_, { id }) => await PatientUser.findById(id),
    isPatient: async (_, __, { req }) => {
      if (!!req.user) {
        const patient = await PatientUser.findById(req.user.id)
        if (patient !== undefined) {
          return true;
        }
        return false;
      }
      return false;
    },
  },
  Mutation: {
    createPatient: async (_, { email, userName, password }) => {
      //Creates a User of Type patient through discriminators. 
      //Create with Empty Lists. 
      const newPatient = new PatientUser({
        email, userName, password,
        motivationalTips: [], vitalReports: [], symptoms: []
      });
      return await newPatient.save();
    },
    updatePatient: async (_, { id, email, userName, password, motivationalTips, vitalReports, symptoms }) =>
      await PatientUser.findByIdAndUpdate(id, { email, userName, password, motivationalTips, vitalReports, symptoms }, {
        overwriteDiscriminatorKey: true, new: true
      }),
    assignSympton: async (_, { patientId, symptomId }) => {
      const foundSymptom = SymptomModel.findById(symptomId);
      if (!req.user) throw new Error('Unauthorized');
      if (!foundSymptom) throw new Error('Symptom not in Database');
      const foundPatient = PatientUser.findById(patientId);
      if (!foundPatient) throw new Error('Patient not in Database');
      foundPatient.symptoms.push(symptomId);
      return await foundPatient.save();
    }
  },
};

export default PatientResolvers;
