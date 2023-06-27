const Admin = require('../model/admin');
const User = require('../model/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getLogin = (req, res, next) => {
    let messageLogin = req.flash('login-failed');
    let messageRegist = req.flash('regist-success');

    let message = [];
    if(messageLogin && messageLogin.length > 0){
        message[0] = 'Failed';
        message[1] = messageLogin[0];
    } else if(messageRegist && messageRegist.length > 0){
        message[0] = 'Success';
        message[1] = messageRegist[0];
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
    
    User.findOne({email : email})
    .then ( user => {
        if(!user){
            req.flash('login-failed', 'Login gagal, email atau password salah!');
            return res.redirect('/auth/login')
        }
        return bcrypt
        .compare( password, user.password)
        .then( result => {
            if(result){
                // console.log('Login berhasil')
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

    bcrypt.hash(password, 12)
    .then( hashedpassword => {
        const newUser = new User({
            username: name,
            email: email,
            password: hashedpassword,
        })

        newUser.save();

        req.flash('regist-success', 'Registrasi berhasil, silahkan login');

        return res.redirect('/auth/login');
    })
}

exports.postLogout = (req, res, next) => {
    res.clearCookie('jwt');

    res.redirect('/');
}