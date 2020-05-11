var express = require('express');
var router = express.Router();

const db = require('../data/db');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1', {});


/* GET home page. */

router.get('/', async function(req, res, next) {
  client.lrange('string recentUploads', 0, -1, function(errImg, replyImg){
    client.get('string bestFacts', async function(err, reply){
      console.log("getting facts: ");
      if(reply){
	console.log("From Cache(redis)");
        bf = JSON.parse(reply);
        res.render('index', { title: 'meow.io', recentUploads: replyImg, bestFacts: bf });
      }
      else{
	console.log("From DB since cache was empty");
        bf = (await db.votes()).slice(0,100);
	console.log("Saving to cache and setting the time to expire 10 sec");
        client.set('string bestFacts', JSON.stringify(bf));
        client.expire('string bestFacts', 10);
        res.render('index', { title: 'meow.io', recentUploads: replyImg, bestFacts: bf });
      }
    });
  });
});


module.exports = router;

