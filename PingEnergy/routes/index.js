var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request');
var router = express.Router();
var cache = apicache.middleware;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Ping Energy', buildings: ["Beard", "Chapin", "Clark", "Cragin", "Everett", "Gebbie", "Keefe", "Kilham", "Larcom", "McIntire", "Meadows", "Metcalf", "Stanton", "White", "Young"]});
});


module.exports = router;
