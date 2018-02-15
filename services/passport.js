const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const User = require('../models/userModel');
const config = require('../config');

//Create local Strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
   User.findOne({ email: email}, function(err, user) {
      if(err) {return done(err);}
      if(!user) {return done(null, false);}
      // Check password
      user.comparePassword(password, function(err, isMatch) {
         if(err) {return done(err);}
         if(!isMatch) {return done(null, false);}
         return done(null, user)
      })
   });
});

//Setup options for JWT Strategy
const jwtOptions = {
   jwtFromRequest: ExtractJwt.fromHeader('authorization'),
   secretOrKey: config.secret
}

//create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
// See if user Id in the payload exist in db
//if it does, call "done" with that other
//otherwise, call done without a user object
   User.findById(payload.sub, function(err, user){
      if(err) {return done(err, false);}

      if(user) {
         done(null, user)
      }else{
         done(null, false)
      }
   });
});

//Tell passport to use this Strategy

passport.use(jwtLogin);
passport.use(localLogin);
