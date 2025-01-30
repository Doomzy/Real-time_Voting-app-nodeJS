$(document).ready(function () {
  
  $('.btn-filter').on('click', function () {
    var $target = $(this).data('target');
    $('.table tr').css('display', 'none');
    $('.table tr[data-status="' + $target + '"]').fadeIn('slow');
  })
  
  const pollsTable= document.getElementById("pollsTable")
  
  if(document.getElementsByClassName("donePoll").length == 0){
    pollsTable.insertAdjacentHTML("beforeend", `
      <tr class="donePoll" data-status="done" style="display:none;">
        <td>
          <div class="media">
            <div class="media-body text-center">
              <h4 class="title" style="color: darkgray; font-weight: 500;">
                No Finished Polls
              </h4>
            </div>
          </div>
        </td>
      </tr> 
    `)
  }else{
    $('.table tr[data-status="done"]').css("display","none");
  }
  
  if(document.getElementsByClassName("ongoingPoll").length == 0){
    pollsTable.insertAdjacentHTML("beforeend", `
      <tr class="ongoingPoll" data-status="on_going">
        <td>
          <div class="media">
            <div class="media-body text-center">
              <h4 class="title" style="color: darkgray; font-weight: 500;">
                No Active Polls
              </h4>
            </div>
          </div>
        </td>
      </tr>         
    `)
  }

})

const options_list= document.getElementById('poll_options')

$('#add_opt').on('click',()=>{
  const options_count= options_list.childElementCount
  
  if(options_count <= 3){
    
    let opt_id= options_count
    options_list.insertAdjacentHTML('beforeend',`
    <div class="option-item">
      <label class="form-label d-flex align-items-center" for="opt${opt_id}">
          <div class="text-danger remove-opt" title="Remove">
            <i class="fa fa-times-circle-o"></i>
          </div>
          <input type="text" name="options[${opt_id}][text]" id="opt${opt_id}" class="form-control form-control-lg"
          placeholder="Enter an option" maxlength="200" required/>
          <input type="number" value="${opt_id}" name="options[${opt_id}][id]"class="d-none" maxlength="1" required/>
      </label>
    </div>
    `)

    if (options_count === 3) {
      $('#add_opt').addClass('d-none');
    }
  }else{
    showToast("The Maximum number of options are 4.");
  }
})

$(document).on('click', '.remove-opt', function() {
  $(this).closest('.option-item').remove();
  $('#add_opt').removeClass('d-none');
});

function showToast(toastMsg){
  const msgToast= document.getElementById("errorToast")
  msgToast.querySelector('.toast-body').textContent= toastMsg
  let bsAlert = new bootstrap.Toast(msgToast)
  bsAlert.show()
}

function copyVoteLink(btn){ 
  var poll_link = document.getElementById("poll_link")
  poll_link= poll_link.innerText
  navigator.clipboard.writeText(poll_link)
  btn.innerText= "Link Copied"
} 

///////////////////
const socketUrl = `${window.location.origin}/`
const socket = io(socketUrl);

socket.on('newVote', (voteId)=>{
  let total_voters= +document.getElementById('poll_info').getAttribute('total_voters')+1
  if(total_voters){
    document.getElementById('poll_info').setAttribute('total_voters', total_voters) 
    let optBars= document.getElementsByClassName('optBar')
  
    for(let i=0; i<optBars.length; i++){
      let optTotalVotes= +optBars[i].getElementsByClassName('total_votes')[0].innerText
      if(optBars[i].getAttribute('id') == `optBar${voteId}`){
        optTotalVotes+=1
        optBars[i].getElementsByClassName('total_votes')[0].innerText= optTotalVotes
      }
      
      let votes_percentage= ((optTotalVotes/total_voters) * 100).toFixed(1)
      optBars[i].getElementsByClassName('option_title')[0].style.width= `${votes_percentage}%`
      optBars[i].getElementsByClassName('percent')[0].innerText= `${votes_percentage} %`
    }
  }
})

socket.on("ownerEnded", (link)=>{
  window.location.replace(link)
})
let timers= {}

socket.on("pollsListDone", (poll_id)=>{
  const targetPoll= document.getElementById(poll_id)
  const timerElem= targetPoll.getElementsByClassName("timer")[0]

  targetPoll.setAttribute("data-status", "done")
  targetPoll.classList.replace("ongoingPoll", "donePoll")

  timerElem.classList.replace("on_going", "done")
  timerElem.innerText= "Done"

  clearInterval(timers[poll_id])
  delete timers[poll_id]
})

function endPoll(poll_id){
  $.ajax({
    url:`/polls/end/${poll_id}`,
    method:"POST",

    success: (response)=>{
      if(response.redirect){
        socket.emit("endPoll", {poll_id: poll_id, uid:response.uid, link: response.redirect})
        window.location.replace(response.redirect);
      }
    },
    error: (e)=> {
			alert(e.message);
		}
  })
}

function submitVoteBtn(poll_id){
  const vote_id= document.querySelector('input[name="vote"]:checked').value
  const voter_email= document.getElementById('v_email').value
  const mail_status= $('#sendMail').is(':checked')
  if(voter_email == ''){
    showToast("Please Enter Your Email")
    return
  }
  $.ajax({
    url:`/polls/vote/${poll_id}`,
    method:"POST",
    data: {vote:vote_id, voter_email, mail_status},

    success: (response)=>{
      if(response.redirect){
        socket.emit("voteSubmit", {poll_id, vote_id})
        window.location.replace(response.redirect);
      }else{
        showToast(response.error)
      }
    },
    error: (e)=> {
			alert(e.message);
		}
  })
}

function postRequest(urlName, formId){
  const urls= {
    "login": "/users/login",
    "signup":"/users/signup",
    "createPoll": "/polls/create"
  }
  const pollForm= $(`#${formId}`).serialize()
  $.ajax({
    url:urls[urlName],
    method:"POST",
    data:pollForm,

    success: (res)=>{
      if(res.redirect){
        window.location.replace(res.redirect);
      }else{
        showToast(res.error)
      }
    },
    error: (e)=> {
			alert(e.message);
		}
  })
}