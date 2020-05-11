const multer = require('multer');
const fs = require('fs');

const db = require('../data/db');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1', {});

var express = require('express');
var router = express.Router();

/* GET users listing. */
const upload = multer({ dest: './uploads/' })

router.post('/', upload.single('image'), function (req, res) {
  console.log(req.body) // form fields
  console.log(req.file) // form files

  if (req.file.fieldname === 'image') {
    fs.readFile(req.file.path, async function (err, data) {
      if (err) throw err;
      var img = new Buffer(data).toString('base64');
      console.log("Saving to input queue...");
      client.rpush(['string inputCache', img]);
      console.log("Saving in the output cache to store 5 recent uploads...");
      client.lpush(['string recentUploads', img], function(err, reply){
	      if (reply){
	        client.ltrim('string recentUploads', 0, 4, function(err, reply){
	          if (reply){
              console.log(reply.toString());
            }
            else{
              console.log(err.toString());
            }
          });
        }
	      else {
	        console.log(err.toString());
	      }
      });
      
      // await db.cat(img);
      res.send('Ok');
    });
  }
});

module.exports = router;
