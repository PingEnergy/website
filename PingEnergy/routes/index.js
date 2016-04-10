var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request');
var router = express.Router();
var cache = apicache.middleware;

/* GET home page. */
var jsbObject = { "name": "buildings",
    "children": [
        {"name": "1st",
            "children": [
                {"name": "Beard", "size": 10000, "active": false, "money": "$86.40"}
            ]
        },
        {"name": "2nd",
            "children": [
                {"name": "Chapin", "size": 8500, "active": false, "money": "$80.64"}
            ]
        },
        {"name": "3rd",
            "children": [
                {"name": "Clark", "size": 6000, "active": false, "money": "$74.88"}
            ]
        },
        {"name": "2ndgroup",
            "children": [
                {"name": "Cragin", "size": 6500, "active": false, "money": "$69.12"},
                {"name": "Everett", "size": 6250, "active": false, "money": "$63.36"},
                {"name": "Gebbie", "size": 5500, "active": false, "money": "$57.60"}
            ]
        },
        {"name": "3rdgroup",
            "children": [
                {"name": "Keefe", "size": 5000, "active": false, "money": "$51.84"},
                {"name": "Kilham", "size": 4500, "active": false, "money": "$46.08"},
                {"name": "Larcom", "size": 3800, "active": false, "money": "$40.32"}
            ]
        },
        {"name": "4thgroup",
            "children": [
                {"name": "McIntire", "size": 3750, "active": false, "money": "$34.56"},
                {"name": "Meadows", "size": 3500, "active": false, "money": "$28.80"},
                {"name": "Metcalf", "size": 3250, "active": false, "money": "$23.04"}
            ]
        },
        {"name": "5thgroup",
            "children": [
                {"name": "Stanton", "size": 3000, "active": false, "money": "$17.28"},
                {"name": "White", "size": 2750, "active": false, "money": "$11.52"},
                {"name": "Young", "size": 2500, "active": false, "money": "$5.76"}
            ]
        }
    ]
};

router.get('/', function(req, res) {
  res.render('index', { title: 'Ping Energy', listBuildings: ["Beard", "Chapin", "Clark", "Cragin", "Everett", "Gebbie", "Keefe", "Kilham", "Larcom", "McIntire", "Meadows", "Metcalf", "Stanton", "White", "Young"], data: JSON.stringify(jsbObject)});
});


module.exports = router;
