var express = require('express');
var router = express.Router();


router.route('/:time').get(function(req, res) {
    var time = req.params.time;
    var getDBTime = null;
    var dbStart = 0;
    if(time == 'h'){
        getDBTime = 'HourlyEnergy';
    }else if(time == 'w'){
        getDBTime = 'WeeklyEnergy';
    }else{
        getDBTime = 'DailyEnergy';
        dbStart = 1;
    }
    var db = req.db;
    var collection = db.get(getDBTime);

    collection.find({},{},function(e,docs){

        //get data array to right length
        var data = [];
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
        //subtract out to get energy usage
        // for (var i = 1; i < docs.length; i++) {
        //     var building = docs[i]["building"];
        //     for (var j = 0; j<data.length-1; j++) {
        //         data[j][building] = data[j][building]-data[j+1][building];
        //     }
        // }

        //remove last element which wasn't subtracted for energy usage
        // data.pop();

        //add in date for each data array obj
        // var arrayIndex = 0;
        // for (day in docs[1]["energyUsage"]) {
        //     if (arrayIndex < data.length-1) {
        //         data[arrayIndex]["date"] = day;
        //         arrayIndex += 1;
        //     }
        // }

        //alternate way of storing data (how Lexos Rolling Window does it)
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
        for (var i = dbStart; i < docs.length; i++) {
            dataLine = [];
            sumEnergy = 0;
            sumDay = 0;
            for (day in docs[i]["energyUsage"]) {
                dataLine.push([day, docs[i]["energyUsage"][day]]);
                sumEnergy += docs[i]["energyUsage"][day];
                sumTime += 1;
            }
            totalEnergy += sumEnergy;
            beds.push(docs[i].beds);
            data2.push(dataLine);
            buildings.push(docs[i].building);
            buildingRanks.push([docs[i].building, sumEnergy, sumTime]);
            buildingRanksPerBed.push([docs[i].building, sumEnergy/docs[i].beds, sumTime]);
        }

        //calculate average of each day and add to data array objs
        var averageLine = [];
        var avg = 0;
        var avgDivisor = buildings.length;
        var totalBeds = beds.reduce(add, 0);
        for (var j = 0; j < data.length; j++) {
            avg = 0;
            for (building in data[j]) {
                avg += parseFloat(data[j][building]);
            }
            avg -= parseFloat(data[j]["Date"]);
            averageLine.push([data[j]["Date"], avg/avgDivisor]);
        }

        data2.push(averageLine);
        beds.push(totalBeds/avgDivisor);
        buildings.push("Average");
        buildingRanks.push(["Average", totalEnergy/avgDivisor, sumTime]);
        buildingRanksPerBed.push(["Average", totalEnergy/totalBeds, sumTime]);

        // for (var j = 0; j < data2.length; j++) {
        //     for (var k=0; k<data2[j].length-1; k++) {
        //         data2[j][k][1] = data2[j][k][1] - data2[j][k+1][1];
        //     }
        // }

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

        var choices = ["Energy Usage Per Bed","Energy Usage", "CO2 Consumption", "Tree Offset"];

        function compare(a,b) {
            return parseFloat(b[1]) - parseFloat(a[1]);
        }

        function add(a, b) {
            return a + b;
        }

        res.render('linegraph', {title: 'Ping Energy' , graphData: JSON.stringify(data), graphData2: JSON.stringify(data2), beds: JSON.stringify(beds), buildings: JSON.stringify(buildings), buildingSorted: buildingSorted, buildingSortedPerBed: buildingSortedPerBed, buildingRanks: JSON.stringify(buildingRanks), choices: choices});
    });
});

router.route('/').get(function(req, res) {
    res.redirect('/linegraph/d');
});

router.post('/', function(req, res) {
    var button = req.body.Cheese;
    res.render('linegraph', {});
});

module.exports = router;