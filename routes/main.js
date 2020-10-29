var jwt = require('jsonwebtoken');
var moment = require('moment');
var tokenSecret = 'someSecret';
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var async = require('async');

var smtpTransport = nodemailer.createTransport({
    host: 'secureams31.sgcpanel.com',
    port: 465,
    secure: true,
    auth: {
        user: 'system@koinonikosantiktypos.gov.gr',
        pass: 'R5@*0gtP@#B,'
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.login = function (req, res, next) {
    console.log('Loging in USER with email:', req.body.email)
    req.db.User.findOne({
        email: req.body.email
    }, null, {
            safe: true
        },
        function (err, user) {
            if (err) return next(err);
            if (!user) return res.send(401, 'Δεν υπάρχει χρήστης με αυτό το Email');
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (!isMatch) return res.send(401, 'Λάθος email ή και κωδικός πρόσβαση');
                var token = jwt.sign({
                    user: user,
                    iat: Math.floor(Date.now() / 1000) - 30
                },
                    tokenSecret
                );
                res.send({
                    userId: user._id,
                    token: token
                });
            });
        });
};

exports.logout = function (req, res) {
    console.log(req.user);
    //console.info('Logout USER: ' + req.session.userId);
    req.session.destroy(function (error) {
        if (!error) {
            res.send({
                msg: 'Logged out'
            });
        }
    });
};

exports.ensureAuthenticated = function (req, res, next) {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        try {
            var decoded = jwt.decode(token);
            req.user = decoded.user;
            return next();
        } catch (err) {
            return res.send(500, 'Error parsing token');
        }
    } else {
        return res.send(401);
    }
}

exports.forgot = function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            req.db.User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    return res.send(400, 'Δεν υπάρχει χρήστης με αυτό το email');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var mailOptions = {
                to: user.email,
                from: 'system@koinonikosantiktypos.gov.gr',
                subject: 'Επαναφορά Κωδικού -  Εργαλείο Αποτύπωσης Κοινωνικού Αντικτύπου',
                text: 'Λαμβάνετε αυτό το email γιατί εσείς (ή κάποιος άλλος) έχετε ζητήσει επαναφορά κωδικού για τον λογαριασμό σας στο Εργαλείο Αποτύπωσης Κοινωνικού Αντικτύπου (https://koinonikosantiktypos.gov.gr/) .\n\n' +
                    'Παρακαλώ ακολουθήστε τον ακόλουθο σύνδεσμο για την ολοκλήρωση της διαδικασίας:\n\n' +
                    'https://koinonikosantiktypos.gov.gr/#!/reset/' + token + '\n\n' +
                    'Αν δεν ζητήσατε εσείς επαναφορά κωδικού απλώς αγνοήστε το μήνυμα και ο κωδικός σας θα παραμείνει ο ίδιος.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log(err);
                    return res.send(500, 'Error sending Email');
                }
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        return res.send({
            msg: 'Reset mail send'
        });
    });
}

exports.getReset = function (req, res) {
    req.db.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (err) return next(err);
        if (!user) {
            return res.send(400, 'Ο κωδικός επαναφοράς είναι άκυρος ή έχει λήξει');
        }
        res.send({
            reset: true,
        });
    });
}

exports.setReset = function (req, res) {
    async.waterfall([
        function (done) {
            req.db.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (err) return next(err);
                if (!user) {
                    return res.send(400, 'Ο κωδικός επαναφοράς είναι άκυρος ή έχει λήξει');
                }
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save(function (err) {
                    done(err, user);
                });
            });
        },
        function (user, done) {
            var mailOptions = {
                to: user.email,
                from: 'system@koinonikosantiktypos.gov.gr',
                subject: 'Ο κωδικός σας έχει αλλάξεις',
                text: 'Χαίρετε,\n\n' +
                    'Σας επιβεβαιώνουμε ότι ο κωδικός για τον λογαριασμό σας ' + user.email + ' έχει αλλάξει.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                if (err) {
                    console.log(err);
                    return res.send(500, 'Error sending Email');
                }
                done(err);
            });
        }
    ], function (err) {
        if (err) return next(err);
        return res.send({
            msg: 'Password has been reset!'
        });
    });
}