const nodemailer = require('nodemailer');

exports.sendMail = (destination) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "indomaju.material@gmail.com",
            // pass: process.env.EMAIL_PASS,
            pass: 'obknkibqisfnrgdx',
        }
    })
    
    const mailOptions = {
        from: "indomaju.material@gmail.com",
        to: "calvindanyalson@gmail.com",
        subject: "Nodemailer Test",
        text: "TEs sending gmail text to other mail"
    }
    
    transporter.sendMail(mailOptions, function (err, info) {
        if(err) {
            console.log(err);
        }
    })
}