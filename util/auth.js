const jwt = require('jsonwebtoken');
const User = require('../model/user');

exports.authCheck = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        await User.findOne({ _id: decodedToken.iduser })
        .then( user => {
            req.user = decodedToken;
            req.user = {
                ...decodedToken,
                totalKeranjang: user.keranjang.length,
            };
            req.isLoggedIn = true;
            // console.log(req.user)
        })
    } catch (err) {
        req.isLoggedIn = false;
    }
    next();
}