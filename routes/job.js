var express = require('express');
var router = express.Router();
var request = require('request');

var Job = require('../models/job');

/*
    ROUTES:
    1. /jobs        GET     get current user's jobs                             X
    2. /jobs/:id    GET     get specific job in order to edit it
    3. /jobs/:id    PUT     get specific job, edit that shit
    4. /jobs/:id    DELETE  delete this specific job from user's saved jobs
 */

function authenticate(req, res, next) {
    if(!req.isAuthenticated()) {
        req.flash('error', 'Please signup or login.');
        res.redirect('/');
    } else {
        next();
    }
}

// get saved jobs
router.get('/jobs', authenticate, function(req, res) {
    Job.find({user: req.user})
        .then(function(jobs) {
            res.json(jobs);
        });
});

router.post('/jobs', authenticate, function(req, res) {
    var thisJob = new Job({
        user: currentUser._id,
        jobtitle: req.body.jobtitle,
        company: req.body.company,
        formattedLocation: req.body.formattedLocation,
        snippet: req.body.snippet,
        date: req.body.date
    });
    console.log('this job: ', thisJob);
    Job.create(thisJob);
});



router.get('/results', authenticate, function(req, res) {
    request('http://api.indeed.com/ads/apisearch?publisher=9447015102421242&q=developer&l=atlanta&sort=date&radius=&st=&jt=&start=&limit=25&fromage=30&filter=&latlong=&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2&format=json',
    function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var resultsAsJSON = JSON.parse(body);
            console.log('THIS IS HERE: ', resultsAsJSON);
            res.json(resultsAsJSON);
        }
    });
});

router.post('/deletejob', authenticate, function(req, res) {
    console.log('FOUND JOB TO DELETE: ', req.body.jobtitle);
    Job.findOne({jobtitle: req.body.jobtitle})
        .then(function(job) {
            console.log(job.jobtitle, job._id);;

            Job.findByIdAndRemove(job._id, {},
                    function(err, obj) {
                        if (err) next(err);
                        req.session.destroy(function(error) {
                            if (err) {
                                next(err)
                            }
                        });
                        // res.json(200, obj);
                    }
                );

            Job.remove(job);
            // console.log('removed ', job);
    });


    // req.db.User.findByIdAndRemove(req.session.user._id, {},
    //     function(err, obj) {
    //         if (err) next(err);
    //         req.session.destroy(function(error) {
    //             if (err) {
    //                 next(err)
    //             }
    //         });
    //         res.json(200, obj);
    //     }
    // );


    // Job.findByIdAndRemove(req.params.id)
    //     .then(function() {
    //         console.log('delete job maybe');
    //     });
});

module.exports = router;