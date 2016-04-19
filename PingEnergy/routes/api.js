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
                // // console.dir(result);
                // // console.dir(result["group"]["data"][0]["$"]);
                //
                // var timestamp = result["group"]["data"][0]["$"]["time_stamp"];
                //
                // var date = new Date();
                // date.setTime(parseInt(timestamp, 16) * 1000); //start date of data
                //
                // console.dir(result["group"]["data"][0]["r"][0]["c"]); //first minute data
                //
                // // console.dir(JSON.stringify(result));

                var raw = result;
                var newjson = {"building": "Chapin",
                            "startTime": 1,
                            "endTime": 5,
                            "timeInterval": 60,
                            "energyUsage": []
                        }

                newjson["startTime"] = parseInt(result["group"]["data"][0]["$"]["time_stamp"], 16) * 1000;
                newjson["endTime"] = parseInt(result["group"]["data"][0]["$"]["epoch"], 16) * 1000;

                newjson["timeInterval"] = result["group"]["data"][0]["$"]["time_delta"];

                var newTime = newjson["startTime"];

                console.log("newTime: ", newTime);

                for (i in result["group"]["data"][0]["r"]) {

                    newTime = newTime.toString();

                    newRow = {};
                    newRow[newTime] = result["group"]["data"][0]["r"][i]["c"][0];

                    newjson["energyUsage"].push( newRow );

                    newTime = parseInt(newTime) + 60000; //increment 1 minute
                }

                // console.log(newjson);

                // Set our internal DB variable
                var db = req.db;

                // Set our collection
                var collection = db.get('DormEnergyUsage');

                // Submit to the DB
                collection.insert(newjson, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        res.send("There was a problem adding the information to the database.");
                    }
                    else {
                        // And forward to success page
                        // res.redirect("chapin");
                    }
                });

            });

        });


});

router.get('/dbtest', function(req, res) {
    var db = req.db;
    var collection = db.get('DormEnergyUsage');
    collection.find({},{},function(e,docs){
        console.log(docs);
        res.render('dbtest', {});
    });
});

module.exports = router;
