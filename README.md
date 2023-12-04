# Real-time Voting app TS

  ## Table of contents
  * [General info](#general-info)
  * [Packages](#Packages)
  * [How Does it work](#how-does-it-work)
  
  # General info
  this project is a practise for using **_Typescript_** and **_Socket.io_** in Back-end development.<br>
  Its an app that allows users to create and share polls with other people.

  # Packages:
  
    -Typescript ^5.2.2
    -ExpressJs ^4.18.2
    -Tsonwebtoken(JWT) ^9.0.2
    -mongoose ^7.6.3
    -socket.io ^4.7.2
    -nodemailer ^6.9.7
    -ejs ^3.1.9

  # How Does it work:

  ##  1. Accounts<br>
  -  Create a new Account and login.
  -  Users Access this homepage page after loging in.

      ![home](https://github.com/Doomzy/Real-time_Voting-app-nodeJS/assets/41492751/1f3f07d6-cee6-4704-b301-d734282845c8)

1. Start Poll:
   - Only Registered users can create Polls.
   - Poll Owner have the ability to end the poll before the duration or delete it after its done.
   - NOTE: Duration { 0 ~ 59 min} | Options {min 2, max 4}
     
     ![Animation](https://github.com/Doomzy/Real-time_Voting-app-nodeJS/assets/41492751/a3c946fe-f847-4e7f-a0fb-9060def48916)
     
2. My Polls:
   - Only users can access their own dashboard.
   - Users can display Previous and Ongoing Polls.
     
     ![Animation](https://github.com/Doomzy/Real-time_Voting-app-nodeJS/assets/41492751/0d8acc61-99a4-4331-ab81-f32724ddc8b6)
     
3. Profile:
   - Displays the user's Info.
4. Logout:
   - Logs the user out.

  ##  2. Voting<br>
  -  Make a Vote:
     - After voting the option you choose will be highlighted with green in the poll page.
     - Doesn't need an account to vite.
       
        ![Animation](https://github.com/Doomzy/Real-time_Voting-app-nodeJS/assets/41492751/74d74aaf-2b5c-4cb4-9bd7-46ef317c7cc7)
     
  -  Real-time Updates:
     - The updates include poll status, poll timer and votes made.

        ![Animation](https://github.com/Doomzy/Real-time_Voting-app-nodeJS/assets/41492751/fcfbfd81-aa78-4f15-b8bd-01e609067bfb)
     
  -  Receive an E-mail:
     - If you check the "send result" box when voting, you will receive the result once the poll is done.

        ![Animation](https://github.com/Doomzy/Real-time_Voting-app-nodeJS/assets/41492751/f33e4a84-05e8-47e8-84c9-cb6e62764e7d)

