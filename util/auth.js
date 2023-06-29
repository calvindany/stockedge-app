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

            if(user.role == 'admin'){
                req.isAdmin = true;
            }

            req.isLoggedIn = true;
            // console.log(req.user)
        })
    } catch (err) {
        req.isLoggedIn = false;
    }
    next();
}

exports.authCheckAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        await User.findOne({ _id: decodedToken.iduser, role: 'admin'})
        .then( user => {
            if(!user){
                return res.redirect('/auth/login');
            }
            req.user = decodedToken;
            req.user = {
                ...decodedToken,
                totalKeranjang: user.keranjang.length,
            };

            req.isAdmin = true;
            req.isLoggedIn = true;

            next();
        })
    } catch (err) {
        return res.redirect('/auth/login');
    }
}