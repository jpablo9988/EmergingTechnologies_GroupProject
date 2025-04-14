import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Using discriminators to represent polymorphism:
// For more info: https://thecodebarbarian.com/2015/07/24/guide-to-mongoose-discriminators

var options = { discriminatorKey: 'kind' };
const userSchema = new Schema({
    // Uniques: 
    email: {
        type: String,
        unique: true,
        required: 'Email is required',
        trim: true
    },
    // ---------------------------
    userName: {
        type: String,
        required: 'Username is required',
        trim: true
    },
    password: {
        type: String,
        validate: [
            (password) => password && password.length > 6,
            'Password should be longer than 6. '
        ]
    }
},
    options);

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(this.password.trim(), salt);
    this.password = hashedPassword;
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;