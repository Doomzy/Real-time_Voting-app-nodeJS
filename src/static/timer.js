
const ongoingPolls= document.getElementsByClassName("ongoingPoll")
if(ongoingPolls.length > 0){
    for(let i=0; i<ongoingPolls.length; i++){
        const timerElem= ongoingPolls[i].getElementsByClassName("timer")[0]
        const page_type= ongoingPolls[i].getAttribute("data-type")
        const pollId= ongoingPolls[i].getAttribute("id")

        const startTime= new Date(ongoingPolls[i].getElementsByClassName("date")[0].getAttribute("data"))
        const endTime= new Date(startTime.getTime() + +timerElem.innerText *60000)

        timers[pollId]=  setInterval(()=>{

            const currentTime= new Date()
            let timer= new Date(endTime- currentTime)
            timer.setSeconds(timer.getSeconds() + 1)
            
            if(timer > 0){
                timerElem.innerText= 
                timer.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
                + " : " +
                timer.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            }
            else{
                clearInterval(timers[pollId])
                delete timers[pollId]
                if(page_type == "list"){
                    ongoingPolls[0].setAttribute("data-status", "done")
                    ongoingPolls[0].classList.replace("ongoingPoll", "donePoll")

                    timerElem.classList.replace("on_going", "done")
                    timerElem.innerText= "Done"
                }else{
                    window.location.reload()
                }
            }
        }, 1000) 
    }
}
