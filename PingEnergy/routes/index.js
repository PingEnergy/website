var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request'),
    xml2js = require('xml2js');
    math = require('mathjs');

var router = express.Router();
var cache = apicache.middleware;

//assuming buildings come with buildings IN ORDER from most to least ENERGY SAVED
function createBuildingObject(buildings) {
    //constants
    var jsb = { "name": "buildings", "children" : []};
    var groupNames = ["1st", "2nd", "3rd", "2ndgroup", "2ndgroup", "2ndgroup", "3rdgroup", "3rdgroup", "3rdgroup", "4thgroup", "4thgroup", "4thgroup", "5thgroup", "5thgroup", "5thgroup"];
    var sizeScale = 4000;
    var moneyScale = .14;
    var carbonScale = .6379;

    //loop buildings to create object
    for (i = 0; i < buildings.length; i++) {
        var kwh = buildings[i][Object.keys(buildings[i])];

        var size = math.round((kwh * sizeScale) * 100)/100;
        var money = math.round((kwh * moneyScale) * 100)/100;
        var c02 = math.round((kwh * carbonScale) * 100)/100;

        var child = {"name": groupNames[i],
            "children": [
                {"name": Object.keys(buildings[i])[0], "size": size, "active": false, "money": money, "carbon": c02}
            ]
        }

        jsb["children"].push(child);
    }

    return jsb;
}

function createBuildingList(buildings) {
    var listBuildings = [];

    for (i = 0; i < buildings.length; i++) {
        listBuildings.push(Object.keys(buildings[i])[0]);
    }

    return listBuildings;
}

function sumMoney(buildings) {
    var moneySum = 0;

    for (i = 0; i < buildings.length; i++) {
        moneySum += buildings[i][Object.keys(buildings[i])[0]] * .14;
    }

    return math.round((moneySum*100))/100;
}

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('DormEnergyPerDay');
    collection.find({"data": { $exists: 1 }},{},function(e,docs){
        console.log(docs[0]);

        if (docs[0]["current_date"] != docs[0]["last_update_date"]) {
            updateBubbleValues(docs, req);
        }

        var jsbObject = createBuildingObject(docs[0]["money"]);
        var listBuildings = createBuildingList(docs[0]["money"]);
        var moneySum = docs[0]["money_sum"];

        res.render('index', { title: 'Ping Energy', moneySum: moneySum, listBuildings: listBuildings, data: JSON.stringify(jsbObject)});
    });
});

function updateBubbleValues(docs, req) {
    var db = req.db;
    var collection = db.get('DormEnergyPerDay');

    var current_date = new Date();
    current_date.setTime(docs[0]["current_date"]);
    var last_update_date = new Date();
    last_update_date.setTime(docs[0]["last_update_date"]);

    console.log("Current date: ", current_date);
    console.log("Last update date: ", last_update_date);

    request('http://egauge-clark-mcintire-young.wheatoncollege.edu/cgi-bin/egauge-show?d' ,
    function (error, response, body) {
        var parseString = xml2js.parseString;
        var xml = body;
        parseString(xml,
        function (err, result) {

            var end_date = (parseInt(result["group"]["data"][0]["$"]["time_stamp"], 16) * 1000)-691200000;






            // Submit to the DB
            // collection.insert({}, function (err, doc) {
            //     if (err) {
            //         res.send("There was a problem adding the information to the database.");
            //         console.log(err);
            //     }
            //     else {
            //         console.log("DormEnergyUsagePerDay: success!");
            //     }
            // });
        });
    });
}


module.exports = router;
