var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request'),
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
            updateBubbleValues();
        }

        var jsbObject = createBuildingObject(docs[0]["money"]);
        var listBuildings = createBuildingList(docs[0]["money"]);
        var moneySum = docs[0]["money_sum"];

        res.render('index', { title: 'Ping Energy', moneySum: moneySum, listBuildings: listBuildings, data: JSON.stringify(jsbObject)});
    });
});

updateBubbleValues() {

}


module.exports = router;
