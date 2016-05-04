var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request'),
    xml2js = require('xml2js');
var router = express.Router();
var cache = apicache.middleware;

router.get('/:building', function(req, res, next) {

    var names = ["Beard", "Emerson-Dorm", "Chapin", "Everett-Heights", "Kilham", "Larcom"];

    var namestwo = ["Young", "McIntire", "Clark"];

    // request('http://egauge-beard.wheatoncollege.edu/cgi-bin/egauge-show?n=64' ,
    
    // function (error, response, body) {
    //     var parseString = xml2js.parseString;
    //     var xml = body;

    //     parseString(xml,
    //     function (err, result) {

    //         var newjson = {"building": "Beard",
    //                     "endTime": 5,
    //                     "startTime": 1,
    //                     "beds": 28,
    //                     "energyUsage": {}
    //                 };

    //         //energyUsagePerDay
    //         var endTime = parseInt(result["group"]["data"][0]["$"]["time_stamp"], 16) * 1000;
            
    //         newjson["endTime"] = endTime;

    //         console.log("length: ", result["group"]["data"][0]["r"].length-1);

    //         var newTime = newjson["endTime"];

    //         for (var i = 0; i < 61; i++) {
    //             newTime = newTime.toString();

    //             nextVal = (parseInt(result["group"]["data"][0]["r"][i]["c"][0]) - parseInt(result["group"]["data"][0]["r"][i+1]["c"][0]))/3600000;
    //             newjson["energyUsage"][newTime] = nextVal;

    //             newTime = parseInt(newTime) - 86400000;
    //         }

    //         newjson["startTime"] = newTime.toString();

    //         // Set our internal DB variable
    //         var db = req.db;

    //         // Set our collection
    //         var collection = db.get('DailyEnergy');

    //         // Submit to the DB
    //         collection.insert(newjson, function (err, doc) {
    //             if (err) {
    //                 // If it failed, return error
    //                 res.send("There was a problem adding the information to the database.");
    //                 console.log(err);
    //             }
    //             else {
    //                 // And forward to success page
    //                 console.log("DormEnergyUsagePerDay: success!");
    //             }
    //         });
    
    //     });     
    
    // });
});
   

router.get('/dbtest', function(req, res) {
    var db = req.db;
    var collection = db.get('DormEnergyUsagePerDay');
    collection.find({},{},function(e,docs){
        console.log(docs);
        res.render('dbtest', {});
    });
});

module.exports = router;

//energyUsage
// request('http://cs.wheatoncollege.edu/~egauge/' + building + '/'  + building + '.xml',
//energyUsagePerDay

// request('http://egauge-beard.wheatoncollege.edu/cgi-bin/egauge-show?d' ,

    // function (error, response, body) {
    //     var parseString = xml2js.parseString;
    //     var xml = body;
    //
        // parseString(xml,
        // function (err, result) {


                // energyUsage every minute
                //
                // newjson["startTime"] = parseInt(result["group"]["data"][0]["$"]["time_stamp"], 16) * 1000;
                // newjson["endTime"] = parseInt(result["group"]["data"][0]["$"]["epoch"], 16) * 1000;
                // newjson["timeInterval"] = result["group"]["data"][0]["$"]["time_delta"];
                // var newTime = newjson["startTime"];
                // for (var i in result["group"]["data"][0]["r"]) {
                //
                //     newTime = newTime.toString();
                //
                //     newEnergy = {};
                //     newEnergy[newTime] = result["group"]["data"][0]["r"][i]["c"][0];
                //
                //     newjson["energyUsage"].push( newEnergy );
                //
                //     newTime = parseInt(newTime) + 60000; //increment 1 minute
                // }



                // energyUsagePerDay
                // newjson["endTime"] = parseInt(result["group"]["data"][0]["$"]["time_stamp"], 16) * 1000;
                // newjson["startTime"] = newjson["endTime"] - 4579200000;
                // newjson["timeInterval"] = result["group"]["data"][0]["$"]["time_delta"];
                // var newTime = newjson["endTime"] - 4579200000;
                // for (var i=53; i>=0; i--){
                //      newTime = newTime.toString();
                //      newEnergy = {};
                //      newCO2 = {};
                //      newTree = {};
                //      newEnergy[newTime] = result["group"]["data"][0]["r"][i]["c"][0];
                //      console.log(newTime);
                //      console.log(newEnergy[newTime]);
                //      newjson["energyUsage"].push( newEnergy );
                //      newCO2[newTime] = result["group"]["data"][0]["r"][i]["c"][0]*0.6379;
                //      newjson["co2"].push(newCO2);
                //      newTree[newTime] = newEnergy[newTime] *0.00159;
                //      newjson["treeOffset"].push(newTree);
                //      newTime = parseInt(newTime) + 86400000; //increment 1 minute
                //
                // }





//                 newjson["energyUsage"] = [];
//                 newTime = newjson["startTime"];
//                 for (i in result["group"]["data"][0]["r"]) {
//                     newTime = newTime.toString();
//
//                     newCO2 = {};
//                     newCO2[newTime] = parseInt(result["group"]["data"][0]["r"][i]["c"][0]) * .6379;
//
//                     newjson["co2"].push( newCO2 );
//
//                     newTime = parseInt(newTime) + 60000; //increment 1 minute
//                 }
//
//                 // Set our collection
//                 collection = db.get('DormCO2Usage');
//
//                 // Submit to the DB
//                 collection.insert(newjson, function (err, doc) {
//                     if (err) {
//                         // If it failed, return error
//                         console.log(err);
//                     }
//                     else {
//                         // And forward to success page
//                         console.log("DormCO2Usage: success!");
//                     }
//                 });
//
//
//                 newjson["co2"] = [];
//                 newTime = newjson["startTime"];
//
//                 for (i in result["group"]["data"][0]["r"]) {
//                     newTime = newTime.toString();
//
//                     newTree = {};
//                     newTree[newTime] = parseInt(result["group"]["data"][0]["r"][i]["c"][0]) * 0.00159;
//
//                     newjson["treeOffset"].push( newTree );
//
//                     newTime = parseInt(newTime) + 60000; //increment 1 minute
//                 }
//
//                 // Set our collection
//                 collection = db.get('DormTreeOffset');
//
//                 // Submit to the DB
//                 collection.insert(newjson, function (err, doc) {
//                     if (err) {
//                         // If it failed, return error
//                         console.log(err);
//                     }
//                     else {
//                         // And forward to success page
//                         console.log("DormTreeOffset: success!");
//                     }
                // });
