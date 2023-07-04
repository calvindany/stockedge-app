const path = require("path");
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const multer = require("multer");
const cronjob = require("node-cron");
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

const AdminRoutes = require("./routes/admin");

const AuthRoutes = require("./routes/auth");
const UserRoutes = require("./routes/user");

const HitungKeuntungan = require("./util/hitungKeuntungan");

const app = express();

cronjob.schedule('0 0 1 * *', () => {
  HitungKeuntungan();
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer().single('image'))
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
});

app.use("/", UserRoutes);
app.use("/", AdminRoutes);
app.use("/auth", AuthRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI_PROD)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
