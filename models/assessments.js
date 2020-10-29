var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var Assessment = new Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: {
        type: String,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        trim: true
    },
    focus: {
        type: String,
        trim: true
    },
    timeperiod: {
        type: Number,
        min: 0
    },
    timeperiod_assess: {
        type: Number,
        min: 0
    },
    audience: {
        type: String,
        trim: true
    },
    decisions: {
        type: String,
        trim: true
    },
    overview_problem: {
        type: String,
        trim: true
    },
    overview_solution: {
        type: String,
        trim: true
    },
    problems: [{
        problem_title: {
            type: String,
            trim: true
        }
    }],
    solutions: [{
        solution_title: {
            type: String,
            trim: true
        }
    }],
    stakeholders: [{
        stakeholder_title: {
            type: String,
            trim: true
        },
        stakeholder_members: {
            type: Number,
            min: 0
        },
        segments: [{
            segment_title: {
                type: String,
                trim: true
            },
            segment_members: {
                type: Number,
                min: 0
            },
            negative_impact: {
                type: Number,
            },
            positive_impact: {
                type: Number,
            },
            action_title: [{
                type: String,
                trim: true
            }],
            action_output: [{
                type: String,
                trim: true
            }],
            action_inter_outcome: [{
                type: String,
                trim: true
            }],
            actions: [{
                action_defined_outcome: {
                    type: String,
                    trim: true
                },
                action_influence: {
                    type: String,
                    trim: true
                },
                action_measure_change: {
                    type: String,
                    trim: true
                },
                action_people: {
                    type: Number,
                    min: 0
                },
                action_others_contributed: {
                    type: String,
                    trim: true
                },
                action_change_without: {
                    type: Number,
                },
                action_others_contribution: {
                    type: Number,
                },
                action_years: {
                    type: Number,
                    min: 0
                },
                action_importance: {
                    type: Number,
                    min: 0
                },
                action_impact: {
                    type: Number,
                }
            }]
        }]
    }]
});

Assessment.plugin(findOrCreate);

Assessment.statics.findAssessments = function (params, callback) {
    var Assessment = this;
    var searchObj = {};
    return Assessment.find(searchObj, function (err, obj) {
        if (err) return callback(err);
        if (!obj) return callback(new Error('No Assessment found'));
        callback(null, obj);
    });
}

Assessment.statics.findAssessmentById = function (Assessmentid, callback) {
    var Assessment = this;
    return Assessment.findById(Assessmentid, function (err, obj) {
        if (err) return callback(err);
        if (!obj) return callback(new Error('Assessment is not found'));
        callback(null, obj);
    });
}


Assessment.statics.findAssessmentsByAuthor = function (userId, callback) {
    var Assessment = this;
    var searchObj = {};
    if (userId) {
        searchObj = {
            $or: []
        };
        searchObj.$or.push({
            author: userId
        });
    }
    return Assessment.find(searchObj, function (err, obj) {
        if (err) return callback(err);
        if (!obj) return callback(new Error('No Assessment found'));
        callback(null, obj);
    });
}

module.exports = Assessment;