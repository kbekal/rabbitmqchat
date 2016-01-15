/* Dependencies */
var express = require('express')
   ,passport = require('passport')
   ,FacebookStrategy = require('passport-facebook').Strategy
   ,User = require('../models/user.js').User;
   
var router = express.Router();

var FACEBOOK_APP_ID = "739782349499273";
var FACEBOOK_APP_SECRET = "9ed63149d486904b13868c2ec4688611";

router.get('/facebook', 
  passport.authenticate('facebook'),
  function(req, res){
   //Do Nothing
  });

router.get('/facebook/callback',
  passport.authenticate('facebook', {failureRedirect: '/'}),
  function(req, res){
    res.end('Success');
  }
)

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({'id': id}, function(err, user){
    done(err, user);
  });
});

/* Use the facebook strategy for facebook checkins */
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ 'id': profile.id }, function (err, user) {
      if(err) {
        //Deal with error : TODO
      }
      if(user === null ||
         user === undefined){
        User.create({id:profile.id}, function(err, user){
          if(err) {
            //Deal with error : TODO
          }
          return done(null, user);
        });
      }
      
      return done(null, user);
    });
  }
));

module.exports = {
  router : router,
  passport : passport
}


