var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request');
    xml2js = require('xml2js');
var router = express.Router();
var cache = apicache.middleware;

router.get('/:building', cache('1 minute'), function(req, res, next) {
    var building = req.params.building;
    console.log("\nRequest New Data For Building: "+building);

    request('http://cs.wheatoncollege.edu/~egauge/' + building + '/'  + building + '.xml',
        function (error, response, body) {
        //     res.send(body);

            var parseString = xml2js.parseString;
            var xml = body;

            parseString(xml,
            function (err, result) {
                console.dir(result);
                console.dir(result["group"]["data"][0]["$"]);

                var timestamp = result["group"]["data"][0]["$"]["time_stamp"];

                var date = new Date();
                date.setTime(parseInt(timestamp, 16) * 1000); //start date of data

                console.dir(result["group"]["data"][0]["r"][0]["c"]); //first minute data

                console.dir(JSON.stringify(result));
            });

        });


});

module.exports = router;
