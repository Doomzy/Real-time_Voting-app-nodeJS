import JWT from 'jsonwebtoken';
function generateToken(uid, email) {
    return JWT.sign({ uid, email }, process.env.PRIVATE_KEY, { expiresIn: 5 * 24 * 60 * 60 });
}
function getUserIfExist(req, res, next) {
    const token = req.cookies.JWT;
    if (token) {
        JWT.verify(token, process.env.PRIVATE_KEY, (err, vToken) => {
            if (err) {
                res.locals.user = null;
            }
            else {
                res.locals.user = vToken;
            }
        });
    }
    else {
        res.locals.user = null;
    }
    next();
}
function isLoggedIn(req, res, next) {
    getUserIfExist(req, res, () => {
        if (res.locals.user === null) {
            next();
        }
        else {
            res.redirect('/');
        }
    });
}
function isAuthenticated(req, res, next) {
    getUserIfExist(req, res, () => {
        if (res.locals.user === null) {
            res.redirect('/users/login');
        }
        else {
            next();
        }
    });
}
function alreadyVoted(req, res, next) {
    const pollId = req.params.pid;
    if (req.cookies[`poll-${pollId}`]) {
        res.redirect(`/polls/${pollId}`);
    }
    else {
        next();
    }
}
export { generateToken, isAuthenticated, getUserIfExist, alreadyVoted, isLoggedIn };
//# sourceMappingURL=auth.js.map