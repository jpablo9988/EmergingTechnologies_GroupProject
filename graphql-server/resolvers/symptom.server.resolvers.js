import SymptomModel from '../models/symptom.server.model.js';

export const symptomResolvers = {
  Query: {
    symptoms: async () => await SymptomModel.find(),
    symptom: async (_, { id }) => await SymptomModel.findById(id),
  },
  Mutation: {
    addSymptom: async (_, { name, description }, { req }) => {
      if (!req.user) throw new Error('Not authenticated');
      if (!req.user.type === 'nurse') throw new Error('User is not a Nurse');
      const newSymptom = new SymptomModel({ name, description });
      return await newSymptom.save();
    },
    //Only nurses can edit a symptom. 
    editSymptom: async (_, { id, name, description }, { req }) => {
      const symptom = await SymptomModel.findById(id);
      if (!symptom || !req.user) throw new Error('Unauthorized');
      if (!req.user.type === 'nurse') throw new Error('User is not a Nurse');
      return await SymptomModel.findByIdAndUpdate(id, { name, description }, { new: true });
    },
  },
};
