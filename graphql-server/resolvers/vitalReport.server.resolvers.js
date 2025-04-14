import PatientUser from '../models/patient.server.model.js';
import VitalReportModel from '../models/vitalReport.server.model.js';

const vitalReportResolvers = {
  Query: {
    vitalReports: async () => await VitalReportModel.find(),
    vitalReport: async (_, { id }) => await VitalReportModel.findById(id),
  },
  Mutation: {
    //Both Patients and Nurses can add a vital report. 
    addVitalReport: async (_, { patient, date, bodyTemp, heartRate, bloodPressure, respiratoryRate }, { req }) => {
      if (!req.user) throw new Error('Not authenticated');
      const newVitalReport = new VitalReportModel({ patient, date, bodyTemp, heartRate, bloodPressure, respiratoryRate });
      //Validate and Update Patient: 
      const updatedPatient = PatientUser.findById(patient);
      if (!updatedPatient) throw new Error('Patient is not in Database');
      updatedPatient.vitalReports.push(newVitalReport.id);
      await newVitalReport.save();
      await updatedPatient.save();
      return newVitalReport;
    },
    //Only nurses can edit a vital report. 
    editVitalReport: async (_, { id, patient, date, bodyTemp, heartRate, bloodPressure, respiratoryRate }, { req }) => {
      const vitalReport = await VitalReportModel.findById(id);
      if (!vitalReport || !req.user) throw new Error('Unauthorized');
      if (!req.user.type === 'nurse') throw new Error('User is not a Nurse');
      return await VitalReportModel.findByIdAndUpdate(id, { patient, date, bodyTemp, heartRate, bloodPressure, respiratoryRate }, { new: true });
    },
  },
};
export default vitalReportResolvers;
