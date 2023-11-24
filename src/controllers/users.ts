import { Request, Response } from "express";
import User from '../models/user.js'
import { IUser } from "../types/types.js";
import { generateToken } from "../utils/auth.js";

async function login(req: Request, res:Response) {
    try{
        const email: string= req.body.email
        const password: string= req.body.password
        const getUser: IUser= await User.login(email, password)
        
        const uToken: string= generateToken(getUser._id.toString(), getUser.email)
        res.cookie('JWT', uToken, {httpOnly:true, maxAge: 5 * 24*60*60 *1000})
        res.json({"redirect":`/`})
    }catch(e){
        res.json({"error": e.message})
    }
}

function showLoginPage(req: Request, res:Response) {
    return res.render('users/login.ejs')
}

async function createUser(req: Request, res:Response) {
    try{
        const userData: IUser= req.body
        await User.create({...userData})
        res.json({"redirect":`/users/login`})
    }catch(e){
        res.json({"error": e.message})
    }
}

function showSignupPage(req: Request, res:Response) {
    return res.render('users/signup.ejs')
}

async function logout(req: Request, res:Response) {
    res.cookie("JWT", "", {maxAge:1})
    res.redirect('/users/login')
}

async function showProfile(req: Request, res:Response) {
    try{
        const uid: string= req.params.id
        const getUser:IUser= await User.findById(uid).select('-password -updatedAt -__v')
        getUser?
            res.render("users/profile.ejs", {profileUser: getUser})
        :
            res.redirect('/')
    }catch(e){
        res.redirect('/')
    }
}

export {login, createUser, logout, showProfile, showLoginPage, showSignupPage}