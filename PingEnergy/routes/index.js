var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request');
var router = express.Router();
var cache = apicache.middleware;

/* GET home page. */
// var jsbObject = { "name": "buildings",
//     "children": [
//         {"name": "1st",
//             "children": [
//                 {"name": "Beard", "size": 10000, "active": false, "money": "$86.40"}
//             ]
//         },
//         {"name": "2nd",
//             "children": [
//                 {"name": "Chapin", "size": 8500, "active": false, "money": "$80.64"}
//             ]
//         },
//         {"name": "3rd",
//             "children": [
//                 {"name": "Clark", "size": 7000, "active": false, "money": "$74.88"}
//             ]
//         },
//         {"name": "2ndgroup",
//             "children": [
//                 {"name": "Cragin", "size": 6500, "active": false, "money": "$69.12"},
//                 {"name": "Everett", "size": 6250, "active": false, "money": "$63.36"},
//                 {"name": "Gebbie", "size": 5500, "active": false, "money": "$57.60"}
//             ]
//         },
//         {"name": "3rdgroup",
//             "children": [
//                 {"name": "Keefe", "size": 5000, "active": false, "money": "$51.84"},
//                 {"name": "Kilham", "size": 4500, "active": false, "money": "$46.08"},
//                 {"name": "Larcom", "size": 3800, "active": false, "money": "$40.32"}
//             ]
//         },
//         {"name": "4thgroup",
//             "children": [
//                 {"name": "McIntire", "size": 3750, "active": false, "money": "$34.56"},
//                 {"name": "Meadows", "size": 3500, "active": false, "money": "$28.80"},
//                 {"name": "Metcalf", "size": 3250, "active": false, "money": "$23.04"}
//             ]
//         },
//         {"name": "5thgroup",
//             "children": [
//                 {"name": "Stanton", "size": 3000, "active": false, "money": "$17.28"},
//                 {"name": "White", "size": 2750, "active": false, "money": "$11.52"},
//                 {"name": "Young", "size": 2500, "active": false, "money": "$5.76"}
//             ]
//         }
//     ]
// };

buildings = [{"Beard": 60.3}, {"Chapin": 58.2}, {"Clark": 43.5}, {"Cragin": 38}, {"Everett": 37}, {"Gebbie": 34}, {"Keefe": 30}, {"Kilham": 21}, {"Larcom": 19}, {"McIntire": 18.76}, {"Meadows": 18}, {"Metcalf": 17.9}, {"Stanton": 17.8}, {"White": 15}, {"Young": 2}];

//assuming buildings come with buildings IN ORDER from most to least ENERGY SAVED
function createBuildingObject(buildings) {
    var jsb = { "name": "buildings", "children" : []};
    var groupNames = ["1st", "2nd", "3rd", "2ndgroup", "2ndgroup", "2ndgroup", "3rdgroup", "3rdgroup", "3rdgroup", "4thgroup", "4thgroup", "4thgroup", "5thgroup", "5thgroup", "5thgroup"];
    var sizeScale = 1500;
    var moneyScale = .14;
    var carbonScale = .6379;

    for (i = 0; i < buildings.length; i++) {
        var kwh = buildings[i][Object.keys(buildings[i])];

        var size = kwh * sizeScale;
        var money = kwh * moneyScale;
        var c02 = kwh * carbonScale;

        var child = {"name": groupNames[i],
            "children": [
                {"name": Object.keys(buildings[i])[0], "size": size, "active": false, "money": money, "carbon": c02}
            ]
        }

        jsb["children"].push(child);
    }

    return jsb;
}

var jsbObject = createBuildingObject(buildings);

router.get('/', function(req, res) {
  res.render('index', { title: 'Ping Energy', listBuildings: ["Beard", "Chapin", "Clark", "Cragin", "Everett", "Gebbie", "Keefe", "Kilham", "Larcom", "McIntire", "Meadows", "Metcalf", "Stanton", "White", "Young"], data: JSON.stringify(jsbObject)});
});


module.exports = router;
