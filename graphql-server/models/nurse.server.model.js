import mongoose from 'mongoose';
import UserModel from './user.server.model';
const { Schema } = mongoose;

const nurseSchema = new Schema({
});
var NurseUser = UserModel.discriminator('Nurse',
    nurseSchema);

export default NurseUser;