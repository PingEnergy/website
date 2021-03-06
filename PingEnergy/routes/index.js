var express = require('express'),
    apicache = require('apicache'),
    cheerio = require('cheerio'),
    request = require('request'),
    xml2js = require('xml2js');
    math = require('mathjs');

var router = express.Router();
var cache = apicache.middleware;

function createBuildingObject(docs, moneyCounts, listBuildings) {
    //constants
    var jsb = { "name": "buildings", "children" : []};
    var groupNames = ["1", "2", "3", "4", "5", "6", "6", "7", "7", "7", "8", "8", "8"];
    var sizeScale = 4000;
    var carbonScale = .6379;

    //loop buildings to create object
    for (var i = 0; i < listBuildings.length; i++) {
        var building = listBuildings[i];
        var beds = 0;

        for (var j = 1; j < docs.length; j++) {
            if (docs[j]["building"] == building) {
                beds = docs[j]["beds"];
            }
        }

        var kwh = math.round(((moneyCounts[building] * beds) / 1000) * 100)/100;
        var money = math.round((moneyCounts[building]) * 100)/100;
        var size = math.round((moneyCounts[building]) * 100)/100;
        var c02 = math.round((kwh * carbonScale) * 100)/100;

        var child = {"name": groupNames[i],
            "children": [
                {"name": building, "size": size, "active": false, "kwh": kwh, "money": money, "carbon": c02}
            ]
        }

        jsb["children"].push(child);
    }

    return jsb;
}

function createBuildingList(moneyCounts) {
    var listToSort = [];

    for (building in moneyCounts) {
        listToSort.push([building, moneyCounts[building]]);
    }

    listToSort.sort(function(a, b) {return b[1] - a[1]})

    var listBuildings = [];

    for (var i = 0; i < listToSort.length; i++) {
        listBuildings.push(listToSort[i][0]);
    }

    return listBuildings;
}

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('DailyEnergy');
    collection.find({},{},function(e,docs){

        var currentDate = new Date();
        var last_update_date = new Date();
        last_update_date.setTime(docs[0]["last_update_date"]);

        var returned,
            moneyCounts,
            moneySum;

        // ONLY FOR UPDATED DATA (NON-STATIC)
        // if (currentDate.toDateString() !== last_update_date.toDateString()) {
        //     returned = updateBubbleValues(docs, req, currentDate, last_update_date);
        //     moneyCounts = returned[0];
        //     moneySum = math.round(returned[1]*100)/100;
        // }
        // else {
        //     moneyCounts = docs[0]["money"];
        //     moneySum = math.round(docs[0]["money_sum"]*100)/100;
        // }

        moneyCounts = docs[0]["money"];
        moneySum = math.round(docs[0]["money_sum"]*100)/100;

        var listBuildings = createBuildingList(moneyCounts);
        var jsbObject = createBuildingObject(docs, moneyCounts, listBuildings);

        res.render('index', { title: 'Ping Energy', moneySum: moneySum, listBuildings: listBuildings, data: JSON.stringify(jsbObject)});
    });
});

function updateBubbleValues(docs, req, current_date, last_update_date) {
    var db = req.db;
    var collection = db.get('DailyEnergy');

    var daysBack = Math.floor((current_date - last_update_date)/86400000);

    while (last_update_date.toDateString() !== current_date.toDateString()) {

        last_update_date.setTime(last_update_date.getTime() + 86400000);

        var newMoney = docs[0]["money"];

        for (var i=1; i<docs.length; i++) {

            var beginTime = docs[i]["endTime"] - daysBack*86400000;

            var startDate = beginTime - 86400000;
            var startEnergy = docs[i]["energyUsage"][beginTime];

            var weekBefore = beginTime - 7*86400000;
            var weekBeforeOneMoreDay = weekBefore - 86400000;
            var weekBeforeEnergy = docs[i]["energyUsage"][weekBefore];

            var twoWeekBefore = beginTime - 14*86400000;
            var twoWeekBeforeOneMoreDay = twoWeekBefore - 86400000;
            var twoWeekBeforeEnergy = docs[i]["energyUsage"][twoWeekBefore];

            var threeWeekBefore = beginTime - 21*86400000;
            var threeWeekBeforeOneMoreDay = threeWeekBefore - 86400000;
            var threeWeekBeforeEnergy = docs[i]["energyUsage"][threeWeekBefore];

            var fourWeekBefore = beginTime - 28*86400000;
            var fourWeekBeforeOneMoreDay = fourWeekBefore - 86400000;
            var fourWeekBeforeEnergy = docs[i]["energyUsage"][fourWeekBefore];

            if (docs[i]["building"] == "EverettHeights") {
                console.log("vals: ", weekBeforeEnergy, twoWeekBeforeEnergy, threeWeekBeforeEnergy, fourWeekBeforeEnergy, startEnergy, docs[i]["beds"]);
            }

            var difference = (((weekBeforeEnergy + twoWeekBeforeEnergy + threeWeekBeforeEnergy + fourWeekBeforeEnergy)/4) - startEnergy)/docs[i]["beds"];

            if (difference > 0) {
                var currentMoney = newMoney[docs[i]["building"]];
                newMoney[docs[i]["building"]] = currentMoney + (difference * 14);
            }
        }

        daysBack -= 1;
    }

    // Submit to the DB
    var id = docs[0]["_id"];
    var newMoneySum = 0;

    for (var mon in newMoney) {
        newMoneySum += parseFloat(newMoney[mon]);
    }

    console.log(newMoney);
    console.log(newMoneySum);
    // collection.update({"_id": id}, {$set: {"last_update_date": current_date.getTime(), "money": newMoney, "money_sum": newMoneySum}});

    return [newMoney, newMoneySum];
}


module.exports = router;
