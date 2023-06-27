const jwt = require('jsonwebtoken');
exports.authCheck = (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken;
        req.isLoggedIn = true;
    } catch (err) {
        
        req.isLoggedIn = false;
    }

    next();
}