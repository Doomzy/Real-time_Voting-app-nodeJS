import { Request, Response } from "express";
import { IPoll, ITokenUser } from "../types/types.js";
import Poll from '../models/poll.js'
import mailSender from '../utils/mailer.js'

let timers:Object= {}

async function createPoll(req: Request, res:Response) {
    try{
        const tokenUser: ITokenUser= res.locals.user
        const {topic, options, duration}= req.body as IPoll  
        const newPoll: IPoll= await Poll.create(
            {owner:tokenUser, topic, options, duration}
        )
        if(newPoll){
            timers[newPoll._id]= setTimeout(async()=>{
                await Poll.findByIdAndUpdate(
                    {_id:newPoll._id},{done: true}
                )
                mailSender(newPoll)
                delete timers[newPoll._id]
            }, duration *60*1000)
            res.json({"redirect":`/polls/${newPoll._id}`})
        }
        else{
            res.json({"error": "Something Went Wrong"})
        }
    }catch(e){
        res.json({"error": e.message})
    }
}

async function pollForm(req: Request, res:Response) {
    return res.render("polls/poll_form.ejs")
}

async function endPoll(req: Request, res:Response) {
    try{
        const pollId: string= req.params.pid
        await Poll.findOneAndUpdate({_id:pollId, "owner.uid": res.locals.user.uid}, {done: true})
        .then((poll)=> {
            clearTimeout(timers[poll._id])
            mailSender(poll)
            delete timers[poll._id]
            res.json({"redirect":`/polls/${poll.id}`, "uid": poll.owner.uid})
        })
        .catch((e)=>{
            res.json({"error": e.message})
        })  
    }catch(e){
        res.json({"error": e.message})
    }
}

async function cancelPoll(req: Request, res:Response) {
    try{
        const pollId: string= req.params.pid
        await Poll.findOneAndDelete({_id:pollId, "owner.uid": res.locals.user.uid})
        .then(()=>{
            res.redirect(`/polls/mypolls`)
        } )
        .catch((e)=> res.redirect(`/polls/${pollId}`))
    }catch(e){
        res.redirect(`/`)
    }
}

async function showPoll(req: Request, res:Response) {
    try{
        const pollId: string= req.params.pid
        const poll: IPoll= await Poll.findById(pollId)
        const alreadyVoted: string|undefined= req.cookies[`poll-${pollId}`]
        poll? res.render('polls/poll_page.ejs', {poll, alreadyVoted, req})
            :
        res.redirect('/')
    }catch(e){
        res.redirect('/')
    }
}

async function userPolls(req: Request, res:Response) {
    try{
        const uId: string= res.locals.user.uid
        await Poll.find({"owner.uid":uId}).sort({ createdAt: -1 })
        .then((polls)=>{
            let doneP: IPoll[]= []
            let ongoingP:IPoll[] = []
            polls.map((poll)=>{
                if(poll.done === true){
                    doneP.push(poll)
                }else{
                    ongoingP.push(poll)
                }
            })
            res.render('polls/user_polls.ejs', {ongoingP, doneP})
        })
        .catch((e)=> res.redirect('/'))
    }catch(e){
        res.redirect('/')
    }
}

async function pollVotePage(req: Request, res:Response) {
    try{
        const pollId: string= req.params.pid
        const poll: IPoll= await Poll.findById(pollId)
            if (poll == null){
                throw Error("Invalid Poll ID")
            }else if(poll.done == true){
                res.redirect(`/polls/${poll._id}`)
            }
            else{
                res.render('polls/poll_vote.ejs', {poll})
            }
    }catch(e){
        res.redirect(`/`)
    }
}

async function submitVote(req: Request, res:Response){
    try{
        const pollId: string= req.params.pid
        const vote : string= req.body.vote
        const voter_email : string= req.body.voter_email.trim()
        const mail_status : boolean= req.body.mail_status

        await Poll.findOne({_id:pollId, done:false})
        .then(async(poll)=>{
            if(poll.voters.find(vo=> vo.email == voter_email)){
                res.json({"error": "This Email Already Voted"})
            }else{
                await poll.updateOne(
                    {$inc :{'total_voters' : 1, [`options.${vote}.votes`]:1},
                    $addToSet:{voters: {email:voter_email, mail_status:mail_status}}
                })
                res.cookie(`poll-${pollId}`, vote,{maxAge:poll.duration*60*1000})
                res.status(200).json({"redirect":`/polls/${poll.id}`})
            }
        })
        .catch((e)=>{
            res.json({"error": e.message})
        })     
    }catch(e){
        res.json({"error": e.message})
    }
}

export {createPoll, pollForm, endPoll, cancelPoll, showPoll, userPolls, pollVotePage, submitVote}