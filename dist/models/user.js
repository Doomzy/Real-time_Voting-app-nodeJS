import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'please enter an email'],
        unique: true,
        lowercase: true,
        immutable: true
    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minLength: [8, 'The password should be more than 8 characters']
    },
    first_name: {
        type: String, maxLength: 20,
        required: [true, 'please enter a first name']
    },
    last_name: {
        type: String, maxLength: 20,
        required: [true, 'please enter a last name']
    },
    phone: {
        type: String, maxLength: 20,
        unique: true,
        required: [true, 'please enter a phone number']
    }
});
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
UserSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email }).select("-updatedAt -__v");
    if (user !== null) {
        const comparePass = await bcrypt.compare(password, user.password);
        if (comparePass) {
            delete user.password;
            return user;
        }
        throw Error('Incorrect login data');
    }
    throw Error('Incorrect login data');
};
export default mongoose.model("User", UserSchema);
//# sourceMappingURL=user.js.map