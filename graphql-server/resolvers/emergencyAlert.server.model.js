import EmergencyAlertModel from '../models/emergencyAlert.server.model.js';

export const emergencyAlertResolvers = {
    Query: {
        emergencyAlerts: async () => await EmergencyAlertModel.find(),
        emergencyAlert: async (_, { id }) => await EmergencyAlertModel.findById(id),
    },
    Mutation: {
        sendEmergencyAlert: async (_, { patient, date }, { req }) => {
            if (!req.user) throw new Error('Not authenticated');
            const newEmergencyAlert = new EmergencyAlertModel({ patient, date });
            return await newEmergencyAlert.save();
        },
    },
};