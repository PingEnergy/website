var express = require('express');
var router = express.Router();


router.route('/').get(function(req, res) {
    res.render('linegraph', {title: 'Ping Energy' });
});


router.route('/:building').get(function(req, res) {
	res.send("Under Construction");
});

module.exports = router;