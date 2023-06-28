const path = require("path");
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const cronjob = require("node-cron");
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

const AdminRoutes = require("./routes/admin");
const AdminModel = require("./model/admin");

const AuthRoutes = require("./routes/auth");
const UserRoutes = require("./routes/user");

const HitungKeuntungan = require("./util/hitungKeuntungan");

const app = express();

// const store = new MongoDBStore({
//   uri: process.env.MONGODB_URI,
//   collection: "userSession",
// });

cronjob.schedule('0 0 1 * *', () => {
  HitungKeuntungan();
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single('image'))
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, '/public/images')));
app.use(cookieParser());

app.use(
  session({
    secret: "mysecret",
    cookie: { maxAge: 60000 }, 
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash())
  
app.use((req, res, next) => {
  return next();
  // if (!req.session.admin) {
  // }
  // AdminModel.findById(req.session.admin._id)
  //   .then((admin) => {
  //     req.admin = admin;
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

app.use("/", UserRoutes);
app.use("/", AdminRoutes);
app.use("/auth", AuthRoutes);

mongoose
  .connect(process.env.MONGODB_URI_PROD)
  .then(() => {
    AdminModel.find().then((admin) => {
      if (admin.length < 1) {
        bcrypt.hash(" ", 12).then((hashedPassword) => {
          const admin = new AdminModel({
            username: "admin",
            password: hashedPassword,
          });
          admin.save();
        });
      }
    });

    app.listen(3000, () => {
      console.log(`Server running in http://localhost:${3000}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
