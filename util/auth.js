const jwt = require('jsonwebtoken');
const User = require('../model/user');

exports.authCheck = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        
        if(!token){
            req.flash('user-failed', 'Silahkan login dahulu!')
            return res.redirect('/auth/login')
        }
        
        await User.findOne({ _id: decodedToken.iduser })
        .then( user => {
            if(!user){
                req.flash('user-failed', 'Silahkan login dahulu!')
                return res.redirect('/auth/login')
            }
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
            next();
        })
    } catch (err) {
        req.flash('user-failed', 'Silahkan login dahulu!')
        req.isLoggedIn = false;
        return res.redirect('/auth/login')
    }
}

exports.authCheckAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        if(!token){
            req.flash('admin-failed', 'Silahkan login dahulu sebagai admin!')
            return res.redirect('/auth/login');
        }

        await User.findOne({ _id: decodedToken.iduser, role: 'admin'})
        .then( user => {
            if(!user){
                req.flash('admin-failed', 'Silahkan login dahulu sebagai admin!')
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
        req.flash('admin-failed', 'Silahkan login dahulu sebagai admin!')
        return res.redirect('/auth/login');
    }
}