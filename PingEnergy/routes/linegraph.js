var express = require('express');
var router = express.Router();


router.route('/').get(function(req, res) {
    var db = req.db;
    var collection = null;
    var data = [];
    var data2 = [];
    var buildings = [];
    var buildingRanks = [];
    var buildingRanksPerBed = [];
    var buildingSorted = [];
    var buildingSortedPerBed = [];
    var beds = [];
    var sumEnergy = 0;
    var sumTime = 0;
    var day = null;
    var dataLine = [];
    var totalEnergy = 0;
    var averageLine = [];
    var avg = 0;
    var avgDivisor = 0;
    var totalBeds = 0;

    function compare(a,b) {
        return parseFloat(b[1]) - parseFloat(a[1]);
    }

    function add(a, b) {
        return a + b;
    }

    function getData(getDBTime, dbStart){
        collection = db.get(getDBTime);

        collection.find({},{},function(e,docs){

            //get data array to right length
            for (iter in docs[1]["energyUsage"]) {
                data.push({});
            }
            //add cumulative energy usage of each building for each day to data array objs
            for (var i = dbStart; i < docs.length; i++) {
                var building = docs[i]["building"];
                var arrayIndex = 0;
                for (usage in docs[i]["energyUsage"]) {
                    data[arrayIndex][building] = docs[i]["energyUsage"][usage];
                    data[arrayIndex]["Date"] = usage;
                    arrayIndex += 1;
                }
            }

            //alternate way of storing data (how Lexos Rolling Window does it)
            
            for (var i = dbStart; i < docs.length; i++) {
                dataLine = [];
                sumEnergy = 0;
                sumDay = 0;
                for (day in docs[i]["energyUsage"]) {
                    dataLine.push([day, parseFloat(docs[i]["energyUsage"][day])]);
                    sumEnergy += parseFloat(docs[i]["energyUsage"][day]);
                    sumTime += 1;
                }
                totalEnergy += sumEnergy;
                beds.push(parseInt(docs[i].beds));
                data2.push(dataLine);
                buildings.push(docs[i].building);
                buildingRanks.push([docs[i].building, sumEnergy, sumTime]);
                buildingRanksPerBed.push([docs[i].building, sumEnergy/parseInt(docs[i].beds), sumTime]);
            }

            //calculate average of each day and add to data array objs
            averageLine = [];
            avg = 0;
            avgDivisor = buildings.length;
            totalBeds = beds.reduce(add, 0);
            for (var j = 0; j < data.length; j++) {
                avg = 0;
                for (building in data[j]) {
                    avg += parseFloat(parseFloat(data[j][building]));
                }
                avg -= parseFloat(data[j]["Date"]);
                averageLine.push([data[j]["Date"], avg/avgDivisor]);
            }

            data2.push(averageLine);
            beds.push(totalBeds/avgDivisor);
            buildings.push("Average");
            buildingRanks.push(["Average", totalEnergy/avgDivisor, sumTime]);
            buildingRanksPerBed.push(["Average", totalEnergy/totalBeds, sumTime]);

            //remove last unusable point
            for (var i = 0; i<data2.length; i++) {
                data2[i].pop();
            }

            buildingRanks.sort(compare);
            for (var i = 0; i < buildingRanks.length; i++){
                buildingSorted.push(buildingRanks[i][0]);
            }

            buildingRanksPerBed.sort(compare);
            for (var i = 0; i < buildingRanksPerBed.length; i++){
                buildingSortedPerBed.push(buildingRanksPerBed[i][0]);
            }
        });

    }

    getData("HourlyEnergy", 0);
    getData("WeeklyEnergy", 0);
    getData("DailyEnergy", 1);

    var choices = ["Energy Usage Per Bed","Energy Usage", "CO2 Consumption", "Tree Offset"];

    res.render('linegraph', {title: 'Ping Energy' , graphData: JSON.stringify(data), graphData2: JSON.stringify(data2), beds: JSON.stringify(beds), buildings: JSON.stringify(buildings), buildingSorted: buildingSorted, buildingSortedPerBed: buildingSortedPerBed, buildingRanks: JSON.stringify(buildingRanks), choices: choices});
});

// router.route('/').get(function(req, res) {
//     res.redirect('/linegraph/d');
// });

// router.post('/', function(req, res) {
//     var button = req.body.Cheese;
//     res.render('linegraph', {});
// });

module.exports = router;