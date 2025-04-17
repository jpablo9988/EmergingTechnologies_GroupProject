import PatientUser from '../models/patient.server.model.js';
import SymptomModel from '../models/symptom.server.model.js';

const PatientResolvers = {
  Query: {
    patients: async () => await PatientUser.find(),
    patient: async (_, { id }) => await PatientUser.findById(id),
    isPatient: async (_, __, { req }) => {
      if (!!req.user) {
        const patient = await PatientUser.findById(req.user.id);
        if (patient == null) return false;
        return patient.kind === "Patient";
      }
      return false;
    },
  },

  Mutation: {
    createPatient: async (_, { email, userName, password }) => {
      const newPatient = new PatientUser({
        email,
        userName,
        password,
        motivationalTips: [],
        vitalReports: [],
        symptoms: [],
        rewardPoints: 0
      });
      return await newPatient.save();
    },

    updatePatient: async (_, {
      id,
      email,
      userName,
      password,
      motivationalTips,
      vitalReports,
      symptoms,
      rewardPoints
    }) => {
      const updateFields = {
        email,
        userName,
        motivationalTips,
        vitalReports,
        symptoms,
      };

      if (password !== undefined) updateFields.password = password;
      if (rewardPoints !== undefined) updateFields.rewardPoints = rewardPoints;

      return await PatientUser.findByIdAndUpdate(
        id,
        updateFields,
        { overwriteDiscriminatorKey: true, new: true }
      );
    },

    assignSymptom: async (_, { patientId, symptomId }, { req }) => {
      if (!req.user) throw new Error('Unauthorized');

      const foundSymptom = await SymptomModel.findById(symptomId);
      if (!foundSymptom) throw new Error('Symptom not found in database');

      const foundPatient = await PatientUser.findById(patientId);
      if (!foundPatient) throw new Error('Patient not found in database');

      if (!foundPatient.symptoms.includes(symptomId)) {
        foundPatient.symptoms.push(symptomId);
        await foundPatient.save();
      }

      return foundPatient;
    },
  },
};

export default PatientResolvers;
