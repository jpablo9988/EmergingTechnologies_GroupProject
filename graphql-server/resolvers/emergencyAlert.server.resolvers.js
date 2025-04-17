import EmergencyAlertModel from '../models/emergencyAlert.server.model.js';
import PatientModel from '../models/patient.server.model.js';

const emergencyAlertResolvers = {
  Query: {
    emergencyAlerts: async () => {
      return await EmergencyAlertModel.find()
        .sort({ resolved: 1, date: -1 })
        .populate('patient')
        .populate('symptoms');
    },
    emergencyAlert: async (_, { id }) => {
      return await EmergencyAlertModel.findById(id)
        .populate('patient')
        .populate('symptoms');
    },
  },

  Mutation: {
    sendEmergencyAlert: async (_, { patient, date, symptoms }, { req }) => {
      if (!req.user) throw new Error('Not authenticated');

      const foundPatient = await PatientModel.findById(patient);
      if (!foundPatient) throw new Error('Patient not found');

      const newEmergencyAlert = new EmergencyAlertModel({
        patient,
        date,
        symptoms // Accept symptoms directly from the mutation input
      });

      return await newEmergencyAlert.save();
    },

    updateEmergencyAlert: async (_, { id, resolved, response }, { req }) => {
      if (!req.user) throw new Error('Not authenticated');

      const alert = await EmergencyAlertModel.findById(id);
      if (!alert) throw new Error('Alert not found');

      if (resolved !== undefined) alert.resolved = resolved;
      if (response !== undefined) alert.response = response;

      return await alert.save();
    }
  }
};

export default emergencyAlertResolvers;
