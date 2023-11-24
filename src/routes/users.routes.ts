import {login, createUser, logout, showProfile, showLoginPage, showSignupPage} from '../controllers/users.js'
import { Router } from "express"
import { isLoggedIn } from '../utils/auth.js'

const router:Router =Router()

router.get('/login', isLoggedIn, showLoginPage)
router.post('/login', login)
router.get('/signup', isLoggedIn, showSignupPage)
router.post('/signup', createUser)
router.get('/logout', logout)
router.get('/:id', showProfile)

export default router