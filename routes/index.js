var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');

var router = express.Router();

var Dropbox = require("dropbox");
var client = new Dropbox.Client({
    key: "4lq986lr70bcmjt",
    secret: "",
    sandbox: false,
    token: ""
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/testfile', function(req, res, next) {
  client.writeFile("test.txt", "sometext", function (error, stat) {
        if (error) {
          console.log(error);
          return;
        }
    });
    res.render('index', { title: 'Express' });
});
router.post('/upload', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        file.on('data', function(data) {
            client.writeFile(filename, data, function (error, stat) {
                if (error) {
                  console.log(error);
                  return;
                 }
            });
        });
    });
});
module.exports = router;
