const User = require('../models/userModel');
const Tokenmodel = require('../models/tokenModel');
const jwt = require('jwt-simple');
const confemail = require('../services/confemail')
const config = require('../config')


function tokenForUser(user){
   const timestamp = new Date().getTime();
   return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}
function decodeToken(token){
   const decoded = jwt.decode(token, config.secret);
   if(decoded){
      console.log("DECODED: "+decoded);
      return decoded;
   }
   console.log("There was a problem");
}
// exports.signin = function(req, res, next) {
//    res.send({ token: tokenForUser(req.user)})
// }

exports.signup = function(req, res, next) {
   const email = req.body.email;
   const password = req.body.password;
   const city = req.body.city;
   const zip = req.body.zip;

   if(!email || !password){
      return res.status(422).send({error: "You must provide email and password"});
   }

   //email exists?
   User.findOne({email: email}, function(err, existingUser){
      if(err) {return next(err);}
      //email does exist return Error
      if(existingUser) {
         return res.status(422).send({ error: 'email is in use'});
      }
      //email doesn't exist create and save record
      const user = new User({
         email: email,
         password: password,
         city: city,
         zip: zip,
         role: 'signedup'

      });
      user.save(function(err){
         if(err){
            return next(err);
         }
      });
      jwtToken = tokenForUser(user);
      const ttl = Date.now()+24*60*60*1000;
      const tokenmodel = new Tokenmodel ({
         jwt: jwtToken,
         ttl: ttl
      });
      tokenmodel.save(function(err){
         if(err){
            return next(err);
         }
      });

   confemail.sendconf(user, jwtToken);

      //respond to request user was created
      res.json({ token: jwtToken })
   });
}

exports.confirm = function(req, res, next){
   const jwt = req.body.token;
   const decoded = decodeToken(jwt);
   const timetest = Date.now();
   User.findOneAndUpdate({_id: decoded.sub},{$set:{"role": "confirmed"}},{new: true}, function(err, updatedDoc){
      if(updatedDoc.role === "confirmed"){
         return res.status(200).json({role: updatedDoc.role})
      }
      if(err){
         res.json({error: err})
      }
   })

}
