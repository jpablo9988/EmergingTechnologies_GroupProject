// nurse.resolvers.js
import NurseUser from '../models/nurse.server.model.js';



const nurseResolvers = {
  Query: {
    nurses: async () => await NurseUser.find(),
    nurse: async (_, { id }) => await NurseUser.findById(id),
    isNurse: async (_, __, { req }) => {
      if (!!req.user) {
        const nurse = await NurseUser.findById(req.user.id)
        if (nurse !== undefined) {
          return true;
        }
        return false;
      }
      return false;
    },
  },
  Mutation: {
    createNurse: async (_, { email, userName, password }) => {
      //Creates a User of Type Nurse through discriminators. 
      const newNurse = new NurseUser({ email, userName, password });
      return await newNurse.save();
    },
    updateNurse: async (_, { id, email, userName, password }) =>
      await NurseUser.findByIdAndUpdate(id, { email, userName, password }, {
        overwriteDiscriminatorKey: true, new: true
      }),
  },
};

export default nurseResolvers;
