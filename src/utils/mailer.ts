import nodemailer from "nodemailer"
import { IOption, IPoll } from "../types/types.js";

export default function(poll: IPoll){
    var transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure:true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const resultOpt: IOption= poll.options.reduce((p, c)=>(p && p.votes > c.votes) ? p : c) 
    const result_percentage: string= ((resultOpt.votes/poll.total_voters)*100).toFixed(1)
    
    let sendResultMails: string[]= []
    poll.voters.map(vo=> vo.mail_status == true? sendResultMails.push(vo.email):false) 

    let mailHTML: string= `
        <h1 style="
            font-weight: bold;  margin: 1rem 0rem; color:#0d6efd; 
            font-size: 2.6rem; text-align: center;
        ">Polls
        </h1>  
        <hr>
        <div>
            <h2>${poll.topic}</h2>
            <small>${new Date(poll.createdAt).toLocaleDateString()}</small>
            <small>
                <span>
                    <strong>Created By : </strong>
                    ${poll.owner.email}
                </span>
            </small>
            <div>
                <span>${resultOpt.text}</span>
                <div style="display: flex;">
                    <span style="
                    width:${result_percentage}%;
                    background-color: #007bff;
                    height: 1.2rem;
                    align-self: center;
                    border-radius: 5px;
                    color: whitesmoke;
                    max-width: 89%;

                    "></span>
                    <small style="padding: 10px 0px 10px 10px;">
                        ${result_percentage} %
                    </small>
                </div>
                <div>
                    <small>Votes:</small>
                    <small>${resultOpt.votes}</small>
                </div>
                <a href="#" target="_blank">See the full result here</a>
            </div>
        </div>
    `

    var mailOptions = {
        from:`Polls Application" <${process.env.MAIL_USER}>`,
        to: sendResultMails,
        subject: `Poll Result: ${poll.topic}`,
        html: mailHTML
        };
    
    if(sendResultMails.length > 0){
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}
