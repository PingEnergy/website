var express = require('express');
var router = express.Router();
//
//function fixData(docs) {
//    for(var i = 0; i < docs.length; i++)
//    {
//        var k = Object.keys(docs[i]["energyUsage"]);
//        for(var j = 0; j < k.length-1 ; j++){
//            docs[i]["energyUsage"][k[j]] = (parseFloat(docs[i]["energyUsage"][k[j]]) - parseFloat(docs[i]["energyUsage"][k[j+1]]));
//        }
//        
//        delete docs[i]["energyUsage"][k[k.length-1]];       
//    }
//
//}

function yearSum(docs) {
    var sum=0;
    for(var doc =0; doc < docs.length; doc++){ //for each document in docs
        //console.log(sum);
        var keys = [];
        keys = Object.keys(docs[doc]["energyUsage"]);

        for(var i=0; i < keys.length; i++) // for each key
        {
            sum = sum + parseFloat(docs[doc]["energyUsage"][keys[i]]);
        }
    }
   
    sum = Math.round(sum * 10000) / 10000;
    return sum;
}

function days(docs) {
    var keys = [];
    var dates = [];
    var days = {};
    var high = 0;
    var low = 11111111;
    for(var k = 0; k < docs.length; k++){
        keys.push(Object.keys(docs[k]["energyUsage"]));
    }
    var one = keys[0];

    for(var d = 0; d < one.length ; d++){
        var myDate = new Date((one[d])*1);
        var date = (myDate.getMonth()+1) + '-' + (myDate.getDate()) + '-' + (myDate.getFullYear());
        dates.push(date)
    }
    // DATES GOES FROM OLDEST DATE TO NEWEST DATE!!!!!
    
    // for each day we have data for
    for(var i = 99; i >= 0; i--){
        var key = dates[i];
        var value = 0.0;
        //for each document
        
        for(var doc = 0; doc < docs.length-1; doc++){           
            value = value + parseFloat(docs[doc]["energyUsage"][keys[doc][i]]);
        }
        if (value > high) {
            high = value;
        
        }
        if (value < low) {
            low = value;
        }
        days[key] = value;
    }
    
    days["high"] = high;
    days["low"] = low;
    
    return days;
    
}

router.route('/').get(function(req, res) {
    var db = req.db;
    var collection = db.get('DailyEnergy');
    collection.find({"data": { $exists: 0 }},{},function(e, docs){
        
        //fixData(docs);
        
        var yearTotal = yearSum(docs);
        var dayTotals = days(docs);
                                                 

        res.render('historical', {title: 'Ping Energy', yeartotal: JSON.stringify({"yearTotal":yearTotal}), days: JSON.stringify(dayTotals) });
    });
});

module.exports = router;