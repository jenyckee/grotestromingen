var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport')
var facebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

mongoose.connect('mongodb://jenyckee:a6*7912S@ds027521.mongolab.com:27521/grotestromingen');

/*
/ Models
*/

var userSchema = mongoose.Schema({
    displayName: String,
    uid : String
})

var User = mongoose.model('User', userSchema)

// ------------------------------------------------ //

passport.use(new facebookStrategy({
    clientID: "396488023841190",
    clientSecret: "5882717d42ecfc1f10dedc6a3d3e727e",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {

      User.findOne({ 'uid': profile.id }, function(err, olduser) {

          if(olduser) {
            console.log('User: ' + olduser.firstname + ' ' + olduser.lastname + ' found and logged in!');
            done(null, olduser);
          } else {
            var newuser = new User();
            newuser.firstname = profile.name.givenName;
            newuser.lastname = profile.name.familyName;

            newuser.save(function(err) {
              if(err) { throw err; }
              console.log('New user: ' + newuser.firstname + ' ' + newuser.lastname + ' created and logged in!');
              done(null, newuser);
            });
          }
    });
  }
));

app.get('/', function(req, res){
    res.render('login', { user: req.user });
});

app.get('/auth/facebook', passport.authenticate('facebook'));


app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/', successRedirect: '/home' }));


app.get('/home', function(req, res){
    console.log(req.user);
    res.render('home', { user: req.user, title: 'Express' });
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    console.log("authentication failed" + req);
    res.redirect('/')
}

module.exports = app;
