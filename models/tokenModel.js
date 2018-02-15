const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
   jwt: {type: String},
   ttl: {type: Date, default: function(){return new Date(Date.now()+2592000000)}},
   born: {type: Date, default: Date.now},
   userID: {type: String}
});

//Create Model Class
const tokenmodel = mongoose.model('tokenmodel', tokenSchema);

//Export the Model
module.exports = tokenmodel;
