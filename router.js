const Auth = require('./controllers/auth');
const passportServices = require('./services/passport');
const passport = require('passport');


const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
module.exports = function(app) {


   // app.post('/api/signin', requireSignin, Auth.signin);
   app.post('/api/signup', Auth.signup);
   app.post('/api/confirm/', Auth.confirm);
   app.get('/', function(req, res) {
      res.sendFile(__dirname + '/index.html')
   });
}
