var express = require('express');
var router = express.Router();


router.route('/').get(function(req, res) {
// router.route('/:building').get(function(req, res) {
	res.send("linegraph");
    // res.render('linegraph', {title: 'Ping Energy' });
});

module.exports = router;