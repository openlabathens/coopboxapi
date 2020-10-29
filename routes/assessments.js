var objectId = require('mongodb').ObjectID;
const fs = require('fs');

exports.getAssessments = function (req, res, next) {
    req.db.Assessment.findAssessments(req.query, function (err, data) {
        if (err) return res.status(400).json(err);
        console.log(data.length);
        if (data.length === 0) {
            res.status(204).json(data)
        } else {
            res.status(200).json(data);
        }
    })
};

exports.getAssessment = function (req, res, next) {
    console.log(req);
    req.db.Assessment.findAssessmentById(req.params.assessmentId, function (err, data) {
        if (req.user._id == data.author) {
            if (err) return next(err);
            console.log(data.length);
            if (data.length === 0) {
                res.status(204).json({ "msg": "Not found" })
            } else {
                res.status(200).json(data);
            }
        } else {
            res.status(401).json("Unauthorized");
        }
    })
};

exports.getUserAssessments = function (req, res, next) {
    if (req.user._id) {
        req.db.Assessment.findAssessmentsByAuthor(req.user._id, function (err, data) {
            if (err) return next(err);
            console.log(data.length);
            if (data.length === 0) {
                res.status(204).json(data)
            } else {
                res.status(200).json(data);
            }
        })

    } else {
        res.status(401).json("No user defined");
    }
};

exports.addAssessment = function (req, res, next) {
    var assessment = new req.db.Assessment(req.body);
    assessment.save(function (err) {
        if (err) {
            res.status(400).json({
                message: "Error in saving record"
            });
        } else {
            res.status(201).json(assessment);
        }
    });
};

exports.updateAssessment = function (req, res, next) {
    req.body.updated = new Date();
    req.db.Assessment.findByIdAndUpdate(req.params.assessmentId, req.body, function (err, assessment) {
        if (err) {
            res.status(400).json({
                message: "Error in updating record" + err
            });
        } else {
            res.status(200).json(assessment);
        }
    });
};


exports.deleteAssessment = function (req, res, next) {
    req.db.Assessment.findAssessmentById(req.params.assessmentId, function (err, data) {
        if (err) return next(err);
        if (req.user._id == data.author) {
            req.db.Assessment.findByIdAndRemove(req.params.assessmentId, function (err, response) {
                if (err) {
                    res.status(400).json({
                        message: "Error in deleting record" + req.params.assessmentId
                    });
                } else {
                    res.status(200).json({});
                }
            });
        } else {
            res.status(401).json("Unauthorized");
        }
    });
};

exports.getExampleAssessment = function (req, res, next) {

    fs.readFile('./models/assessment_example.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            res.status(400).json({
                message: "Error in finding Example Assessment" + err
            });
        } else {
            obj = JSON.parse(data);
            res.status(200).json(obj);
        }
    });

};
