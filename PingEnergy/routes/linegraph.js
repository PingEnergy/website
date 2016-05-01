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
    	//add energy usage of each building for each day to data array objs
    	for (var i = 1; i < docs.length; i++) {
    		var building = docs[i]["building"];
    		var arrayIndex = 0;
    		for (usage in docs[i]["energyUsage"]) {
    			data[arrayIndex][building] = docs[i]["energyUsage"][usage];
    			arrayIndex += 1;
    		}
    	}
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
    		data[arrayIndex]["date"] = day;
    	}

    	res.render('linegraph', {title: 'Ping Energy' , graphData: JSON.stringify(data)});
    });
});


router.route('/:building').get(function(req, res) {
	res.send("Under Construction");
});

module.exports = router;