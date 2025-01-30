
const ongoingPolls= document.getElementsByClassName("ongoingPoll")
if(ongoingPolls.length > 0){
    for(let i=0; i<ongoingPolls.length; i++){
        const timerElem= ongoingPolls[i].getElementsByClassName("timer")[0]
        const pollId= ongoingPolls[i].getAttribute("id")

        const totalTime= ( +timerElem.getAttribute("data-total") || 0) * 60000
        const startTime= new Date(ongoingPolls[i].getElementsByClassName("date")[0].getAttribute("data"))
        const endTime= new Date(startTime.getTime() + totalTime)

        timers[pollId]=  setInterval(()=>{

            const currentTime= new Date()
            let timer= new Date(endTime- currentTime)
            timer.setSeconds(timer.getSeconds() + 1)
            
            if(timer > 0){
                timerElem.innerHTML= 
                timer.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
                + " : " +
                timer.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
            }
            else{
                clearInterval(timers[pollId])
                delete timers[pollId]
                window.location.reload()
            }
        }, 1000) 
    }
}
