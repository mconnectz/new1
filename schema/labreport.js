const mongoose = require('mongoose'); 
var Schema = mongoose.Schema; 
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var labreport = new Schema({
    patientId:{type:String},
    prescribeddoctorId:{type:String},
    patientname:{type:String},
    doctorname:{type:String},
    typeoftest:{type:String},
    dateoftest:{type:String},
    photoupload:{type:String},
     report:{type:String},
   
  ladmin: [{type:Schema.Types.ObjectId,ref: 'ladmin'}]
 
});

labreport.plugin(autoIncrement.plugin, {
   model: 'labreport',
   field: '_id',
   prefix:'labreport_',
   startAt: 100000,
 
 });

module.exports = mongoose.model('labreport', labreport);