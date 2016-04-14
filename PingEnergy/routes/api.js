var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request');
var router = express.Router();
var cache = apicache.middleware;

router.get('/:building', cache('1 minute'), function(req, res, next) {
    var building = req.params.building;
    console.log("\nRequest New Data For Building: "+building);
    request('http://egauge-'+building+'.wheatoncollege.edu/cgi-bin/egauge?tot', function (error, response, body) {
        res.send(body);
    });
});

module.exports = router;
