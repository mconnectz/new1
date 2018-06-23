const mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var medicine = new Schema({
   drugname:{type:String},
   drugbrand:{type:String},
   quantity:{type:String},
   weight:{type:String},
   stock:{type:String},
   price:{type:String},
   tax:{type:String},
   
  padmin: [{type:Schema.Types.ObjectId,ref: 'padmin'}]
 
});

medicine.plugin(autoIncrement.plugin, {
   model: 'Medicine',
   field: '_id',
   prefix:'Medicine_',
   startAt: 100000,
 
 });

module.exports = mongoose.model('Medicine', medicine);