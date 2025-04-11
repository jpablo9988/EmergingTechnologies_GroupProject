import mongoose from 'mongoose';
import UserModel from './user.server.model.js';
const { Schema } = mongoose;
var options = { discriminatorKey: 'type' };

const nurseSchema = new Schema({
},
    options);
var NurseUser = UserModel.discriminator('Nurse',
    nurseSchema);

export default NurseUser;