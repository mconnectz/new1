const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let sAdmin_schema = mongoose.Schema({
  role:{type: String,default:'Sadmin' },
  username: { type: String },
  password:{ type: String }
});


sAdmin_schema.pre('save', function(next){

  if(!this.isModified('password'))
    return next();

  bcrypt.hash(this.password,null,null,(err,hash) => {
    if(err)return next(err);
    this.password = hash;
    next();
  });

});

sAdmin_schema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('SuperAdmins', sAdmin_schema);
