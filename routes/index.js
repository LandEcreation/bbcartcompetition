
require('dotenv').config()


const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const passportLocalMoongoose = require("passport-local-mongoose");
const alert= require("alert");

const router = express.Router();

const User = require('../model/usermodel');

/*this is initial configuration of session*/

console.log(process.env.SECRET);

router.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));


/*initialize the passport */
router.use(passport.initialize());
router.use(passport.session());


passport.use(User.createStrategy());
/*passport.use(new LocalStrategy(User.authenticate()));*/

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});








router.get('/upload', (req, res) => {
  res.render("uploadform");

});



/*authentication */

router.get("/login", function(req, res) {
  res.render("login");
})


/*
handling Login*/
router.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    console.log(user);
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, function() {
      /*  alert("you are logged in Successfully..");*/
        res.redirect("/gallery");
      })
    }
  })


})


router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    alert("you are logged Out Successfully..");
    res.redirect('/');
  });
});



router.get("/register", function(req, res) {
  res.render("register");
})



/*handling register */
router.post("/register", function(req, res) {

  User.register({
      username: req.body.username
    }, req.body.password, function(err, user) {
console.log(user + "found");
      if (err) {
        console.log(err);
        res.redirect("/register");

      } else {

        passport.authenticate("local")(req, res, function() {
          res.redirect("/");
        })
      }

    }



  )


})









module.exports = router;
