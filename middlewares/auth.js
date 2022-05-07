function checkAuthenticated(req, res, next) {
    if (isAuthenticated(req)) {
        return next()
    }
    res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
    if (isAuthenticated(req)) {
        return res.redirect('/users/userProfile')
    }
    next()
}

function isAuthenticated(req) {
    if (req.session && req.session.email) {
        return true;
    } else return false;
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}