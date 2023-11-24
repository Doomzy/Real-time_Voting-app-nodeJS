import { Server } from "socket.io"
import { IVoteRes } from "../types/types.js"

export default function socketConnection(appServer){
    const io: Server= new Server(appServer)
    
    io.on("connection", (socket)=>{
        
        socket.on("pollWatch", (pollId:string)=>{
            socket.join(pollId)
        })

        socket.on("userPolls", (uid:string)=>{
            socket.join("list:"+uid)
        })

        socket.on("voteSubmit", (voteRes:IVoteRes)=>{
            io.to(voteRes.poll_id).emit("newVote", voteRes.vote_id)
        })

        socket.on("endPoll", (response:{poll_id: string, uid:string ,link: string})=>{
            io.to(response.poll_id).emit("ownerEnded", response.link);
            io.to("list:" + response.uid).emit("pollsListDone", response.poll_id)
        })
          
        socket.on("disconnect", ()=>{})
    })

}
