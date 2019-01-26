var Competitor                  = require('../models/competitor');


exports.getOptions = async (id) => {
    const competitor = new Promise ( (resolve, reject) => {
        Competitor.findById(id)
            .exec( (err, competitor) => { (err) ? reject({'success': false, 'message': err.message}) : resolve(competitor)})
    });

    return competitor.then( data  => {
            return data;
        }).catch(error => Promise.reject(error));
};

//GET competitors list
exports.index = (req, res) => {
    Competitor.find({})
        .exec(function (err, list_competitors) {
            if (err) { res.json({'success': false, 'message': err.message}); }

            res.json({'success': true, 'message':'', 'data': list_competitors});
        });
};

// GET competitor settings.
exports.getCompetitor = (req, res) => {
    Competitor.findById(req.params.id)
        .exec(function (err, competitor) {
            if (err) { res.json({'success': false, 'message': err.message}); }

            res.json({'success': true, 'message':'', 'data': competitor});
        });
};

// GET request for competitor settings creating.
exports.competitor_create_get = (req, res) => {
    //TODO: competitor_create_get
};

// POST request for competitor settings creating.
exports.competitor_create_post = (req, res) => {

    let competitor = new Competitor(
        {
            name: req.body.name,
            url: req.body.url,
            reqSchema: req.body.reqSchema,
            resSchema: req.body.resSchema,
            request: req.body.request,
            responseSchema: req.body.schema
        }
    );

    Competitor.findOne({ 'name': req.body.name })
        .exec( (err, rival) => {
            if (err) { res.json({'success': false, 'message': err.message}); }

            if (rival) {
                res.json({'success': false, 'message': 'Name '+req.body.name+' is already used.'});
            }
            else {
                competitor.save( (err, data) => {
                    if (err) { res.json({'success': false, 'message': err.message}); }

                    res.json({'success': true, 'message': 'Competitor '+req.body.name+' saved', 'data': data});
                });
            }
        });
};