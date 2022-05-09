function checkAuthenticated(req, res, next) {
    if (isAuthenticated(req)) {
        return next()
    }
    res.redirect('/')
}

function checkAdminAuthenticated(req, res, next) {
    if (isAdminAuthenticated(req)) {
        return next()
    }
    res.redirect('/admin/login')
}

function checkNotAuthenticated(req, res, next) {
    if (isAuthenticated(req)) {
        return res.redirect('/users/userProfile')
    }
    next()
}

function checkNotAdminAuthenticated(req, res, next) {
    if (isAuthenticated(req)) {
        return res.redirect('/admin/profile')
    }
    next()
}


function isAuthenticated(req) {
    if (req.session && req.session.email) {
        return true;
    } else return false;
}

function isAdminAuthenticated(req) {
    if (req.session && req.session.adminEmail) {
        return true;
    } else return false;
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    checkAdminAuthenticated,
    checkNotAdminAuthenticated
}