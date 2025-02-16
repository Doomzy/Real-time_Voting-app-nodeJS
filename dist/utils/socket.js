import { Server } from "socket.io";
export default function socketConnection(appServer) {
    const io = new Server(appServer);
    io.on("connection", (socket) => {
        socket.on("pollWatch", (pollId) => {
            socket.join(pollId);
        });
        socket.on("userPolls", (uid) => {
            socket.join("list:" + uid);
        });
        socket.on("voteSubmit", (voteRes) => {
            io.to(voteRes.poll_id).emit("newVote", voteRes.vote_id);
        });
        socket.on("endPoll", (response) => {
            io.to(response.poll_id).emit("ownerEnded", response.link);
            io.to("list:" + response.uid).emit("pollsListDone", response.poll_id);
        });
        socket.on("disconnect", () => { });
    });
}
//# sourceMappingURL=socket.js.map