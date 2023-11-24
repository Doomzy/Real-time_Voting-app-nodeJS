import mongoose, {Schema} from "mongoose"
import {IUser, UserModel} from '../types/types.js'
import bcrypt from 'bcrypt'
import { NextFunction } from "express"

const UserSchema: Schema= new Schema<IUser, UserModel>({
    email: {
        type: String, 
        required:[true, 'please enter an email'], 
        unique: true, 
        lowercase:true,
        immutable: true
    },
    password: {
        type: String, 
        required:[true, 'please enter a password'], 
        minLength:[8, 'The password should be more than 8 characters']
    },
    first_name:{
        type: String, maxLength: 20, 
        required:[true, 'please enter a first name']
    },
    last_name:{
        type: String, maxLength: 20, 
        required:[true, 'please enter a last name']
    },
    phone:{
        type: String, maxLength: 20, 
        unique: true, 
        required:[true, 'please enter a phone number']
    }
})

UserSchema.pre('save', async function (next:NextFunction) {
    const salt: string | number= await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password, salt)
    next() 
})

UserSchema.statics.login= async function (email:string, password: string) {
    const user: IUser= await this.findOne({email}).select("-updatedAt -__v")
    if(user !== null){
        const comparePass: boolean= await bcrypt.compare(password, user.password)
        if(comparePass){
            delete user.password
            return user
        }throw Error('Incorrect Password')
    }throw Error('Incorrect Email')
}

export default mongoose.model<IUser, UserModel>("User", UserSchema)