import User from '../models/user.js';
import { generateToken } from "../utils/auth.js";
async function login(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const getUser = await User.login(email, password);
        const uToken = generateToken(getUser._id.toString(), getUser.email);
        res.cookie('JWT', uToken, { httpOnly: true, maxAge: 5 * 24 * 60 * 60 * 1000 });
        res.json({ "redirect": `/` });
    }
    catch (e) {
        res.json({ "error": e.message });
    }
}
function showLoginPage(req, res) {
    return res.render('users/login.ejs');
}
async function createUser(req, res) {
    try {
        const userData = req.body;
        await User.create({ ...userData });
        res.json({ "redirect": `/users/login` });
    }
    catch (e) {
        res.json({ "error": e.message });
    }
}
function showSignupPage(req, res) {
    return res.render('users/signup.ejs');
}
async function logout(req, res) {
    res.cookie("JWT", "", { maxAge: 1 });
    res.redirect('/users/login');
}
async function showProfile(req, res) {
    try {
        const uid = req.params.id;
        const getUser = await User.findById(uid).select('-password -updatedAt -__v');
        getUser ?
            res.render("users/profile.ejs", { profileUser: getUser })
            :
                res.redirect('/');
    }
    catch (e) {
        res.redirect('/');
    }
}
export { login, createUser, logout, showProfile, showLoginPage, showSignupPage };
//# sourceMappingURL=users.js.map