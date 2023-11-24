import mongoose, {Schema} from "mongoose"
import {IPoll} from '../types/types.js'
import { NextFunction } from "express"

const PollSchema: Schema= new Schema<IPoll>({
    owner:{
        uid: {type: String, required: true, immutable:true},
		email: {type:String, required: true, immutable:true}
    },
    topic:{
        type: String, 
        required:[true, 'please provide a topic'], 
        immutable: true,
        maxlength:180
    },
    total_voters:{
        type: Number, 
        default: 0
    },
    voters:[{
		email: {type:String, required: true, immutable:true},
        mail_status: {type: Boolean, required: true, immutable:true}
    }],
    options:[{
        id: {type: Number, required: true, immutable:true},
		text: {type:String, required: true, immutable:true, validate:{
            validator: function(opt: string) {
              return opt.trim() !== ""
            },
            message: () => "You can't have an empty option/s"
          },},
        votes: {type:Number, default:0}
    }],
    duration:{
        type: Number,
        required:[true, 'please provide a time in Minutes'], 
        immutable: true,
        max:59
    },
    done:{
        type: Boolean,
        default: false
    }
}, {timestamps: true})

PollSchema.pre('save', async function (next:NextFunction) {
    if(this.options.length < 2){
        throw Error("You can't have less than 2 options")
    }else if(new Set(this.options.map(({text}) => text)).size !== this.options.length){
        throw Error("You can't have a duplicated options")
    }else{
        next() 
    }
})

PollSchema.index({owner: 1, topic: 1})

export default mongoose.model<IPoll>('Poll', PollSchema)