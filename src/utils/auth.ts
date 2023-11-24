import { NextFunction, Request, Response } from 'express'
import JWT from 'jsonwebtoken'
import { ITokenUser } from '../types/types.js'

function generateToken(uid: string, email: string){
    return JWT.sign({uid, email}, process.env.PRIVATE_KEY, {expiresIn: 5 * 24*60*60})
}

function getUserIfExist(req: Request, res: Response, next: NextFunction){
    const token: string= req.cookies.JWT
    if(token){
        JWT.verify(token, process.env.PRIVATE_KEY, (err, vToken: ITokenUser)=>{
            if(err){
                res.locals.user= null
            }else{
                res.locals.user= vToken
            }
        })
    }else{
        res.locals.user= null
    }
    next()
}

function isLoggedIn(req: Request, res: Response, next: NextFunction){
    getUserIfExist(req, res, ()=>{
        if(res.locals.user === null){
            next()
        }else{
            res.redirect('/')
        }
    })
}

function isAuthenticated(req: Request, res: Response, next: NextFunction){
    getUserIfExist(req, res, ()=>{
        if(res.locals.user === null){
            res.redirect('/users/login')
        }else{
            next()
        }
    })
}

function alreadyVoted(req: Request, res: Response, next: NextFunction){
    const pollId: string= req.params.pid
    if(req.cookies[`poll-${pollId}`]){
        res.redirect(`/polls/${pollId}`)
    }else{
        next()
    }
}

export{ generateToken, isAuthenticated, getUserIfExist, alreadyVoted, isLoggedIn }