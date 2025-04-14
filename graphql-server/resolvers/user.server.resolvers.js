// user.resolvers.js
//User deals with authentication and generic functions (Like get a User by ID.)
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.server.model.js';
import NurseUser from '../models/nurse.server.model.js';
import PatientUser from '../models/patient.server.model.js';

const JWT_SECRET = 'some_secret_key';

const userResolvers = {
    User:
    {
        __resolveType: obj => {
            //Patient has motivational tips.
            if (obj.motivationalTips) return 'Patient';
            else return 'Nurse';
        },
    },
    Query: {
        isLoggedIn: (_, __, { req }) => !!req.user,
        authUserId: (_, __, { req }) => {
            if (!!req.user) {
                return req.user.id;
            }
        }
    },
    Mutation: {
        createUser: async (_, { email, userName, password, type }) => {
            //Creates a User of Type patient through discriminators. 
            //Create with Empty Lists. 
            if (type == 'patient') {
                const newPatient = new PatientUser({
                    email, userName, password,
                    motivationalTips: [], vitalReports: [], symptoms: []
                });
                return await newPatient.save();

            }
            if (type == 'nurse') {
                //Creates a User of Type Nurse through discriminators. 
                const newNurse = new NurseUser({ email, userName, password });
                return await newNurse.save();

            }
            throw new Error('Type is not Valid.');
        },
        //Authentication Stuff: 
        loginUser: async (_, { email, password }, { res }) => {
            const user = await UserModel.findOne({ email });
            if (user) {
                const matchPassword = bcrypt.compare(password, user.password);
                if (!matchPassword) return null;
            }
            else return null;
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            return user;
        },
        logOut: (_, __, { res }) => {
            res.clearCookie('token');
            console.log("Logged Out")
            return 'Logged out successfully!';
        },
    },
};

export default userResolvers;
