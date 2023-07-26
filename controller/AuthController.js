const User = require('../model/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const sendMail = require('../util/sendMail');
const user = require('../model/user');

exports.getLogin = (req, res, next) => {
    let messageLogin = req.flash('login-failed');
    let messageRegist = req.flash('regist-success');
    let messageAdminProtectionRoute = req.flash('admin-failed');
    let messageUserProtectionRoute = req.flash('user-failed');

    let message = [];
    if (messageLogin && messageLogin.length > 0) {
        message[0] = 'Failed';
        message[1] = messageLogin[0];
    } else if (messageRegist && messageRegist.length > 0) {
        message[0] = 'Success';
        message[1] = messageRegist[0];
    } else if (messageAdminProtectionRoute && messageAdminProtectionRoute.length > 0) {
        message[0] = 'Failed';
        message[1] = messageAdminProtectionRoute[0];
    } else if (messageUserProtectionRoute && messageUserProtectionRoute.length > 0) {
        message[0] = 'Failed';
        message[1] = messageUserProtectionRoute[0];
    } else {
        message = null;
    }

    res.render('auth/login', {
        message: message,
    })
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('login-failed', 'Login gagal, email atau password salah!');
                return res.redirect('/auth/login');
            } else if (user.active == false) {
                req.flash('login-failed', 'Silahkan aktivasi terlebih dahulu akun anda');
                return res.redirect('/auth/login');
            }
            return bcrypt
                .compare(password, user.password)
                .then(result => {
                    if (result) {
                        const jwtToken = jwt.sign({
                            iduser: user._id,
                            username: user.username,
                            email: user.email,
                        }, process.env.JWT_SECRET);
                        res.cookie('jwt', jwtToken)

                        res.redirect('/')
                    } else {
                        req.flash('login-failed', 'Login gagal, email atau password salah!');
                        return res.redirect('/auth/login')
                    }
                })
        })
}

exports.getRegister = (req, res, next) => {
    res.render('auth/registrasi')
}

exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const notelp = req.body.notelp;
    const key = crypto.randomBytes(32).toString('hex');

    bcrypt.hash(password, 12)
        .then(hashedpassword => {
            const newUser = new User({
                username: name,
                email: email,
                role: 'user',
                active: false,
                notelp: notelp,
                password: hashedpassword,
                activationToken: key,
            });

            const redirectUrl = process.env.BASE_URL_EMAIL || `http://localhost:3000/auth/email-confirmation?email=${email}&activationToken=${key}`;
            sendMail.sendMail(email, redirectUrl);

            newUser.save();
            req.flash('regist-success', 'Silahkan aktivasi akun anda melalui email yang kami kirimkan');

            return res.redirect('/auth/login');
        })
}

exports.postLogout = (req, res, next) => {
    res.clearCookie('jwt');

    res.redirect('/');
}

exports.postEmailConfirmation = (req, res, next) => {
    const email = req.query.email;
    const activationToken = req.query.activationToken;

    User.findOne({ email: email })
        .then(user => {
            console.log(user)
            console.log(activationToken);
            console.log(user.activationToken);
            if (user.activationToken == activationToken) {
                user.active = true;
                user.activationToken = null;

                req.flash('regist-success', 'Activasi sukses, silahkan login');

                console.log('masik')
                user.save();
                return res.redirect('/auth/login');
            }
            req.flash('regist-success', 'Aktivasi gagal, pastikan email anda sudah benar');
            return res.redirect('/auth/login');
        })
}