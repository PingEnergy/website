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
    	for (var i = 1; i < docs.length; i++) {
    		var dataLine = [];
    		for (day in docs[i]["energyUsage"]) {
    			dataLine.push([day, docs[i]["energyUsage"][day]]);
    		}
    		data2.push(dataLine);
    	}
    	for (var j = 0; j < data2.length; j++) {

    		for (var k=0; k<data2[j].length-1; k++) {
				data2[j][k][1] = data2[j][k][1] - data2[j][k+1][1];
    		}
    	}
    	//remove last unusable point
    	for (var i = 0; i<data2.length; i++) {
    		data2[i].pop();
    	}

    	res.render('linegraph', {title: 'Ping Energy' , graphData: JSON.stringify(data), graphData2: JSON.stringify(data2)});
    });
});


router.route('/:building').get(function(req, res) {
	res.send("Under Construction");
});

module.exports = router;