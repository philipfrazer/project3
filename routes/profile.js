var express = require('express');
var router = express.Router();

var Job = require('../models/job');

function authenticate(req, res, next) {
    if(!req.isAuthenticated()) {
        req.flash('error', 'Please signup or login.');
        res.redirect('/');
    } else {
        next();
    }
}

router.get('/', authenticate, function(req, res, next) {
    var testString = 'passing string';
    Job.find({ jobtitle: 'JobTitle' })
        .then(function(job) {
            console.log(job);
            res.render('profile', {
                string: testString,
                job: job
            });
        });
});

module.exports = router;
