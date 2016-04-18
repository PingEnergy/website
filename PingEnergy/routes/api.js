var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request'),
    parseString = require('xml2js').parseString;

var router = express.Router();
var cache = apicache.middleware;

router.get('/:building', cache('1 minute'), function(req, res, next) {
    var building = req.params.building;
    console.log("\nRequest New Data For Building: "+building);

    var num = parseInt("0x57100854", 16);
    console.log(num);
    var d = new Date(num*1000);
    // d.setUTCMilliseconds(num);
    console.log(d);
    // request('http://cs.wheatoncollege.edu/~egauge/'+building+'/'+building+'.xml', function (error, response, body) {
    //     parseString(body, function (err, result) {
    //         // console.dir(result);
    //         res.json(result);
    //     });

    // });
});

module.exports = router;
