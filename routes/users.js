var objectId = require('mongodb').ObjectID;
var safeFields = 'fullName firstName lastName displayName displayPic headline banner displayName admin institution birthdateDate university discipline topic researchAreas town country hometown phDTopic startPhdDate schoolHistoric currentRoleDate universityHistoric previousRole postOf publicationsNo approved banned role twitterUrl email facebookUrl linkedinUrl githubUrl created updated posts oURole phdSteps';
//Users

exports.getUsers = function(req, res, next) {
    var fields = safeFields;
    if (req.query.fields) {
        fields = req.query.fields.replace(",", " ");
    }
    req.db.User.findUsersByParams(req.query, fields, function(err, data) {
        if (err) return next(err);
        if (data.length === 0) {
            res.status(204).json({"mssg":"No Users"})
        } else {
            res.status(200).json(data);
        }
    })
};

exports.getUser = function(req,  res, next) {
    var fields = safeFields;
    if (req.query.fields) {
        fields = req.query.fields.replace(",", " ");
    }
    req.db.User.findProfileById(req.params.userId, fields, function(err, data) {
        if (err) return next(err);
        res.status(200).json(data);
    })
};

exports.addUser = function(req, res, next) {
    var user = new req.db.User(req.body);
    user.save(function(err) {
        if (err) {
            res.status(400).json({
                message: "Error in saving record" + err
            });
        } else {
            res.status(201).json(user);
        }
    });
};

exports.updateUser = function(req, res, next) {
    req.db.User.findByIdAndUpdate(req.params.userId, req.body, function(err, user) {
        if (err) {
            res.status(400).json({
                message: "Error in updating record" + req.params.id
            });
        } else {
            res.status(200).json(user);
        } 
    });
};

exports.deleteUser = function(req, res, next) {
    req.db.User.findByIdAndRemove(req.params.userId, function(err, response) {
        if (err) {
            res.status(400).json({
                message: "Error in deleting record" + req.params.id
            });
        } else {
            res.status(200).json({});
        }        
    });
};