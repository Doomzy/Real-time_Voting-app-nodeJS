import {Types, Model} from 'mongoose'

interface IUser{
    _id: Types.ObjectId
    email: string
    password: string
    first_name: string
    last_name: string
    phone: string
}

interface UserModel extends Model<IUser>{
    login(email:string, password: string): IUser
}

interface ITokenUser{
    uid: Types.ObjectId
    email: string
}

interface IVoter{
    email: string
    mail_status: boolean
}

interface IPoll{
    _id: string
    owner: ITokenUser
    topic: string
    total_voters: number
    voters: IVoter[]
    options: IOption[]
    duration: number
    done: boolean
    createdAt: string
}

interface IOption {
    id: number
    text: string
    votes: number
}

interface IVoteRes {
    vote_id: string
    poll_id: string
}


export {IUser, UserModel, IVoter, IPoll, IOption, IVoteRes, ITokenUser}