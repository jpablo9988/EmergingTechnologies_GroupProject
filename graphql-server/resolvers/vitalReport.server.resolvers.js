import PatientUser from '../models/patient.server.model.js';
import VitalReportModel from '../models/vitalReport.server.model.js';

const vitalReportResolvers = {
  Query: {
    vitalReports: async () => await VitalReportModel.find().populate('patient'),
    vitalReport: async (_, { id }) => await VitalReportModel.findById(id).populate('patient'),
  },

  Mutation: {
    addVitalReport: async (
      _,
      { patient, date, bodyTemp, heartRate, bloodPressure, respiratoryRate },
      { req }
    ) => {
      if (!req.user) throw new Error('Not authenticated');

      const newVitalReport = new VitalReportModel({
        patient,
        date,
        bodyTemp,
        heartRate,
        bloodPressure,
        respiratoryRate,
      });

      await newVitalReport.save();

      const updatedPatient = await PatientUser.findById(patient);
      if (!updatedPatient) throw new Error('Patient is not in Database');

      if (!updatedPatient.vitalReports) {
        updatedPatient.vitalReports = [];
      }

      updatedPatient.vitalReports.push(newVitalReport._id);
      await updatedPatient.save();

      return newVitalReport.populate('patient');
    },

    editVitalReport: async (
      _,
      { id, patient, date, bodyTemp, heartRate, bloodPressure, respiratoryRate },
      { req }
    ) => {
      if (!req.user) throw new Error('Not authenticated');
      if (req.user.type !== 'nurse') throw new Error('User is not a Nurse');

      return await VitalReportModel.findByIdAndUpdate(
        id,
        { patient, date, bodyTemp, heartRate, bloodPressure, respiratoryRate },
        { new: true }
      ).populate('patient');
    },
  },
};

export default vitalReportResolvers;
