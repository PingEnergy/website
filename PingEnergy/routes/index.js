var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request'),
    math = require('mathjs');

var router = express.Router();
var cache = apicache.middleware;

buildings = [{"Beard": 60.3}, {"Chapin": 58.2}, {"Clark": 43.5}, {"Cragin": 38}, {"Everett": 37}, {"Gebbie": 34}, {"Keefe": 30}, {"Kilham": 21}, {"Larcom": 19}, {"McIntire": 18.76}, {"Meadows": 18}, {"Metcalf": 17.9}, {"Stanton": 17.8}, {"White": 15}, {"Young": 2}];

//assuming buildings come with buildings IN ORDER from most to least ENERGY SAVED
function createBuildingObject(buildings) {
    //constants
    var jsb = { "name": "buildings", "children" : []};
    var groupNames = ["1st", "2nd", "3rd", "2ndgroup", "2ndgroup", "2ndgroup", "3rdgroup", "3rdgroup", "3rdgroup", "4thgroup", "4thgroup", "4thgroup", "5thgroup", "5thgroup", "5thgroup"];
    var sizeScale = 1500;
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

var jsbObject = createBuildingObject(buildings);
var listBuildings = createBuildingList(buildings);

router.get('/', function(req, res) {
  res.render('index', { title: 'Ping Energy', listBuildings: listBuildings, data: JSON.stringify(jsbObject)});
});

//

module.exports = router;
