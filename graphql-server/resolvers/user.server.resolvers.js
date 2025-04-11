// user.resolvers.js
//User deals with authentication and generic functions (Like get a User by ID.)
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.server.model.js';

const JWT_SECRET = 'some_secret_key';

const userResolvers = {
    Query: {
        isLoggedIn: (_, __, { req }) => !!req.user,
        authUserId: (_, __, { req }) => {
            if (!!req.user) {
                return req.user.id;
            }
        }
    },
    Mutation: {
        //Authentication Stuff: 
        loginUser: async (_, { email, password }, { res }) => {
            const user = await UserModel.findOne({ email });
            if (user) {
                const matchPassword = await bcrypt.compare(password, user.password);
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
