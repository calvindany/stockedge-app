const nodemailer = require("nodemailer");

exports.sendMail = (destination, url) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "indomaju.material@gmail.com",
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "indomaju.material@gmail.com",
    to: destination,
    subject: "Indo Maju | New Account Verification",
    html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                    }
                    .container{
                        width: 30rem;
                        text-align: center;
                    }
                    button{
                        padding: 10px;
                        border-radius: 10px;
                        background-color: #D1E7DD;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <form action="${url}" method="POST">
                        <h1>Email Confirmation</h1>
                        <p>This url can only be used once and will expired in  1 hours</p>
                        <button type="submit">Confirm Email</button>
                    </form>
                </div>
            </body>
            </html>
        `,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    }
  });
};
