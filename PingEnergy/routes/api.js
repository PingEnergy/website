var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request'),
    xml2js = require('xml2js');
var router = express.Router();
var cache = apicache.middleware;

router.get('/:building', cache('10 minutes'), function(req, res, next) {
    var building = req.params.building;
    console.log("\nRequest New Data For Building: "+building);

    request('http://cs.wheatoncollege.edu/~egauge/' + building + '/'  + building + '.xml',
        function (error, response, body) {
            var parseString = xml2js.parseString;
            var xml = body;

            parseString(xml,
            function (err, result) {
                // 1kwh = .6379 pounds of co2
                // 2000 pounds of co2 = 5 trees
                // 400 pounds of co2 = 1 tree
                // 400 / 1 = .6379 / x ~> .00159 tree per kwh

                var newjson = {"building": "Chapin",
                            "startTime": 1,
                            "endTime": 5,
                            "timeInterval": 60,
                            "energyUsage": [],
                            "co2": [],
                            "treeOffset": []
                        };

                newjson["startTime"] = parseInt(result["group"]["data"][0]["$"]["time_stamp"], 16) * 1000;
                newjson["endTime"] = parseInt(result["group"]["data"][0]["$"]["epoch"], 16) * 1000;
                newjson["timeInterval"] = result["group"]["data"][0]["$"]["time_delta"];

                var newTime = newjson["startTime"];
                for (var i in result["group"]["data"][0]["r"]) {

                    newTime = newTime.toString();

                    newEnergy = {};
                    newEnergy[newTime] = result["group"]["data"][0]["r"][i]["c"][0];

                    newjson["energyUsage"].push( newEnergy );

                    newTime = parseInt(newTime) + 60000; //increment 1 minute
                }

                

                // Set our internal DB variable
                var db = req.db;

                // Set our collection
                var collection = db.get('DormEnergyUsage');

                // Submit to the DB
                collection.insert(newjson, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        res.send("There was a problem adding the information to the database.");
                        console.log(err);
                    }
                    else {
                        // And forward to success page
                        console.log("DormEnergyUsage: success!");
                    }
                });


                newjson["energyUsage"] = [];
                newTime = newjson["startTime"];
                for (i in result["group"]["data"][0]["r"]) {
                    newTime = newTime.toString();

                    newCO2 = {};
                    newCO2[newTime] = parseInt(result["group"]["data"][0]["r"][i]["c"][0]) * .6379;

                    newjson["co2"].push( newCO2 );

                    newTime = parseInt(newTime) + 60000; //increment 1 minute
                }

                // Set our collection
                collection = db.get('DormCO2Usage');

                // Submit to the DB
                collection.insert(newjson, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        console.log(err);
                    }
                    else {
                        // And forward to success page
                        console.log("DormCO2Usage: success!");
                    }
                });


                newjson["co2"] = [];
                newTime = newjson["startTime"];

                for (i in result["group"]["data"][0]["r"]) {
                    newTime = newTime.toString();

                    newTree = {};
                    newTree[newTime] = parseInt(result["group"]["data"][0]["r"][i]["c"][0]) * 0.00159;

                    newjson["treeOffset"].push( newTree );

                    newTime = parseInt(newTime) + 60000; //increment 1 minute
                }

                // Set our collection
                collection = db.get('DormTreeOffset');

                // Submit to the DB
                collection.insert(newjson, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        console.log(err);
                    }
                    else {
                        // And forward to success page
                        console.log("DormTreeOffset: success!");
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
