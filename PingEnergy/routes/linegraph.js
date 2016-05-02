var express = require('express');
var router = express.Router();


router.route('/').get(function(req, res) {
    var db = req.db;
    var collection = db.get('DormEnergyPerDay');

    collection.find({},{},function(e,docs){

        //get data array to right length
        var data = [];
        for (iter in docs[1]["energyUsage"]) {
            data.push({});
        }
        //add cumulative energy usage of each building for each day to data array objs
        for (var i = 1; i < docs.length; i++) {
            var building = docs[i]["building"];
            var arrayIndex = 0;
            for (usage in docs[i]["energyUsage"]) {
                data[arrayIndex][building] = docs[i]["energyUsage"][usage];
                arrayIndex += 1;
            }
        }
        //subtract out to get energy usage
        for (var i = 1; i < docs.length; i++) {
            var building = docs[i]["building"];
            for (var j = 0; j<data.length-1; j++) {
                data[j][building] = data[j][building]-data[j+1][building];
            }
        }

        //remove last element which wasn't subtracted for energy usage
        data.pop();

        //calculate average of each day and add to data array objs
        for (var j = 0; j < data.length; j++) {
            var avg = 0;
            var avgDivisor = 0;
            for (building in data[j]) {
                avg += parseFloat(data[j][building]);
                avgDivisor += 1;
            }
            data[j]["Average"] = avg/avgDivisor; 
        }
        //add in date for each data array obj
        var arrayIndex = 0;
        for (day in docs[1]["energyUsage"]) {
            if (arrayIndex < data.length-1) {
                data[arrayIndex]["date"] = day;
                arrayIndex += 1;
            }
        }

        //alternate way of storing data (how Lexos Rolling Window does it)
        var data2 = [];
        var buildings = [];
        var buildingRanks = [];
        var buildingSorted = [];
        var sumEnergy = 0;
        var sumTime = 0;
        var day = null;
        for (var i = 1; i < docs.length; i++) {
            var dataLine = [];
            for (day in docs[i]["energyUsage"]) {
                dataLine.push([day, docs[i]["energyUsage"][day]]);
            }
            data2.push(dataLine);
            buildings.push(docs[i].building);
        }

        for (var j = 0; j < data2.length; j++) {
            sumEnergy = 0;
            sumDay = 0;
            for (var k=0; k<data2[j].length-1; k++) {
                data2[j][k][1] = data2[j][k][1] - data2[j][k+1][1];
                sumEnergy += data2[j][k][1];
                sumTime += 1;
            }
            buildingRanks.push([docs[j+1].building, sumEnergy, sumTime]);
        }
        //remove last unusable point
        for (var i = 0; i<data2.length; i++) {
            data2[i].pop();
        }
        // console.log(buildingRanks);

        buildingRanks.sort(function(a, b){
            return a[1] < b[1];
        });

        for (var i = 0; i < buildingRanks.length; i++){
            buildingSorted.push(buildingRanks[i][0]);
        }

        var choices = ["Energy Usage", "CO2 Consumption"];

        res.render('linegraph', {title: 'Ping Energy' , graphData: JSON.stringify(data), graphData2: JSON.stringify(data2), buildings: JSON.stringify(buildings), buildingSorted: buildingSorted, buildingRanks: JSON.stringify(buildingRanks), choices: choices});
    });
});


router.route('/:building').get(function(req, res) {
    res.send("Under Construction");
});

module.exports = router;