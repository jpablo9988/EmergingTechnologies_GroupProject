// graphql-server/resolvers/nurse.server.resolvers.js
import NurseUser from '../models/nurse.server.model.js';


const nurseResolvers = {
  Query: {
    nurses: async () => await NurseUser.find(),
    nurse: async (_, { id }) => await NurseUser.findById(id),
    isNurse: async (_, __, { req }) => {
      if (!!req.user) {
        const nurse = await NurseUser.findById(req.user.id);
        if (nurse == null) return false;
        return nurse.kind === "Nurse";
      }
      return false;
    },
  },

  Mutation: {
    createNurse: async (_, { email, userName, password }) => {
      const newNurse = new NurseUser({ email, userName, password });
      return await newNurse.save();
    },
    updateNurse: async (_, { id, email, userName, password }) =>
      await NurseUser.findByIdAndUpdate(
        id,
        { email, userName, password },
        { overwriteDiscriminatorKey: true, new: true }
      ),

    predictMedicalCondition: async (_, { symptoms }) => {
      const result = predictConditionFromSymptoms(symptoms);
      return {
        condition: result.condition,
        score: result.score
      };
    },
  },
};

export default nurseResolvers;
