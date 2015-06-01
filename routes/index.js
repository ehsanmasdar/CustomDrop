var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var inspect = require('util').inspect;
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
  res.render('index.html');
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
router.post('/upload', function(req, res) {
    var fstream,lastname,period,firstname,secret,assignment,extension;
    req.pipe(req.busboy);
    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      	console.log('Field [' + fieldname + ']: value: ' + inspect(val));
      	if (fieldname == "lastname"){lastname = val;}
        if (fieldname == "firstname"){firstname = val;}
	if (fieldname == "period"){period = val;}
	if (fieldname == "secret"){secret = val;}
	if (fieldname == "assignment"){assignment = val;}
	if (fieldname == "extension"){
		req.busboy.on('file', function (fieldname, file, filename) {
       		 console.log("Uploading: " + filename);
       		 file.on('data', function(data) {
		 var finalfilename = period + "/" + lastname + firstname + secret + "_" + assignment + "." + val;
           	 client.writeFile(finalfilename, data, function (error, stat) {
               		 if (error) {
                	  console.log(error);
                	  return;
                	 }
        	    });
       		 });
	    });
	}
    });
    res.render('success.html');
});
module.exports = router;
