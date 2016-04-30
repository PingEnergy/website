var express = require('express');
var router = express.Router();

function yearSum(docs, keyList) {
//    console.log(keyList);
//    var sum=0;
//    for(var doc =0; doc<9; doc++){
//        for(var i=0; i < keyList.length; i++)
//        {
//            console.log(docs[doc]["energyUsage"][i]);
//        }
//    }
//    
//    return sum;
}

function days(docs, keyList) {    
}

router.route('/').get(function(req, res) {
    var db = req.db;
    var collection = db.get('DormEnergyPerDay');
    collection.find({"data": { $exists: 0 }},{},function(e,docs){
        
        var keys = [];
        var keylen = Object.keys(docs[0]["energyUsage"]).length;
        console.log(keylen);
        for (var i = 0; i < keylen; i++) {
            var myDate = new Date((Object.keys(docs[1]["energyUsage"][i])[0])*1);
           // console.log(myDate);
            var date = (myDate.getMonth()+1) + '-' + (myDate.getDate()) + '-' + (myDate.getFullYear());


            // console.log(date);
            //console.log(Object.keys(docs[0]["energyUsage"][i])[0]);
            //keys.push(myDate);
        }
        
        var yearTotal = yearSum(docs, keys);
        var dayTotals = days(docs, keys);
        //.00159 tree per kwh * kwh = trees to offset for that day

        res.render('historical', {title: 'Ping Energy' });
    });
});

module.exports = router;
