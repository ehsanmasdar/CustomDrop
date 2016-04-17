var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var inspect = require('util').inspect;
var router = express.Router();
var path = require('path')
var Dropbox = require("dropbox");
var cookieParser = require('cookie-parser');
var multer  = require('multer')
var upload = multer({ dest: '/home/rmueller/CustomDrop/uploads/' })

var client = new Dropbox.Client({
    key: "x",
    secret: "x",
    sandbox: false,
    token: "x"
});

router.get('/', function(req, res, next) {
 console.log("Cookies: ", req.cookies);
    if (req.cookies.period && req.cookies.lastname && req.cookies.firstname && req.cookies.secret)
     res.render('index.html',req.cookies);
 else
     res.render('index.html',{period:"",lastname:"",firstname:"",secret:""});
});
router.get('/newdesign',function(req,res,next){
  res.render('newdesign.html',{period:"",lastname:"",firstname:"",secret:""});
});
router.get('/testfile', function(req, res, next) {
  client.writeFile("test.txt", "sometext", function (error, stat) {
        if (error) {
          console.log(error);
          return;
        }
    });
    res.render('index.html');
});
router.post('/upload',upload.single('file'), function(req, res,next) {
    var finalfilename = req.body.period + "/" + req.body.lastname + req.body.firstname + req.body.secret + "_" + req.body.assignment + path.extname(req.file.originalname);
    fs.readFile(req.file.path, function(error, data) {
      if (error) {
        console.log(error);
      }
      client.writeFile(finalfilename, data, function(error, stat) {
        if (error) {
          console.log(error);
        }
      });
    });
    res.render('success.html');
});
module.exports = router;
