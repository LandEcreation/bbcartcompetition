/*This is to access file from env */

require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const fs = require('fs');
const path = require('path');
const findOrCreate = require('mongoose-findorcreate');



const router = require('./routes');


mongoose.connect(process.env.MONGO_URL || process.env.MONGO_URL_CLOUD, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  console.log('connected to dB')
});



const app = express();
app.use(bodyParser.urlencoded({
  extended: false
}))




app.use(bodyParser.json())

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use('', router);



const  multer = require('multer');


/*here multer is for file uploading*/
/*  Step 5 - set up multer for storing uploaded files*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({
  storage: storage
});


/*Requiring imagemodel here*/
const imgModel = require('./model/imagemodel');




app.get("/", (req, res) => {
  res.render("index");
});


app.post('/', upload.single('image'), (req, res, next) => {
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    fullname: req.body.fullname,
    email: req.body.email,
    number: req.body.number,
    img: {
      data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      contentType: 'image'
    }
  }
  imgModel.create(obj, (err, item) => {
/*    console.log(obj);*/
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect('/thanks');
    }
  });
});



app.get("/gallery", (req, res) => {

  if (req.isAuthenticated()) {
    imgModel.find({}, (err, images) => {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred', err);
      } else {
      /*  console.log(images);*/

        res.render('gallery', {
        images: images
        });
      }
    });
  } else {
    res.redirect("/login");
  }
})









app.get("/uploads/:uploadId", (req, res) => {



  const requestImageID = req.params.uploadId;


  imgModel.findOne({
    _id: requestImageID
  }, function(err, foundItem) {
    console.log(foundItem);
    console.log(foundItem.fullname);
    if (!err) {




      const imagetype = foundItem.img.contentType;
      const imgdata = foundItem.img.data.toString('base64');

      if (req.isAuthenticated()) {


        res.render("image", {
          name: foundItem.name,
          desc: foundItem.desc,
          email: foundItem.email,
          number: foundItem.number,
          imagetype: imagetype,
          imgdata: imgdata,
          fullname: foundItem.fullname,
          district: foundItem.district,
          municipalityname: foundItem.municipalityname,
          wardno: foundItem.wardno
        });

      } else {
        res.render("login");
      }

    }

  });

});











// Step 9 - configure the server's port

const port = process.env.PORT ? process.env.PORT : 4000;

/*if (port == null || port == "") {
  port = 3000;
}*/



app.listen(port, err => {
  if (err)
    throw err
  console.log('Server listening on port', port)
})
