var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request');
var router = express.Router();
var cache = apicache.middleware;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Ping Energy' });
});

router.get('/historical', function(req, res) {
	res.render('historical', {title: 'Ping Energy' });
});

router.get('/api/:building', cache('1 minute'), function(req, res, next) {
    var building = req.params.building;
    console.log("\nRequest New Data For Building: "+building);
    request('http://egauge-'+building+'.wheatoncollege.edu/cgi-bin/egauge?tot', function (error, response, body) {
        console.log(body);
        res.send("Check Your Console.");
    });
});



module.exports = router;
