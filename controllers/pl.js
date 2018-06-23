
const doctor = require('../schema/doctor');
const patient = require('../schema/patient');
const padmin = require('../schema/pharm_admin');
//const ladmin = require('../schema/lab_admin');

const prescription = require('../schema/prescribe');

module.exports={

newPatient: async(req,res,next)=>{
        const newDoctor = new patient(req.body);
        const user = await newPatient.save(); 
        res.send(user);
      },

getPatient:async (req, res, next)=>{
  
  const users = await patient.find({});
  res.send(users);
  
  },

  getPatbyId: async(req, res, next) =>{
    const {patId}= req.params;
    const user = await patient.findById(patId);
    res.send(user);
  },


getPadmin: async(req,res,next)=>{
  const {patId} = req.params;
  const user = await patient.findById(patId).populate('padmins');
  res.send(user.padmins);
},

getPadminbyId: async(req, res, next) =>{
    const {pharmId}= req.params;
    const user = await padmin.findById(pharmId);
    res.send(user);
  },

newPadmin: async(req,res,next)=>{
  const {patId} = req.params;
  const newPadmin = new padmin(req.body);
  const pat = await patient.findById(patId);
  newPadmin.patient = pat;
  await newPadmin.save();

  //user.patients.push(newPatient);
  pat.padmins=pat.padmins.concat(newPadmin);
  await pat.save();
  res.send(newPadmin);
},

getPrescription: async(req,res,next)=>{
  const {pharmId} = req.params;
  const user = await padmin.findById(pharmId).populate('prescriptions');
  res.send(user.prescriptions);
},

getPrescriptionbyId :  async(req, res, next) =>{
  const {presId}= req.params;
  const user = await prescription.findById(presId);
  res.send(user);
},

newPrescription: async(req,res,next)=>{
  const {patId} = req.params;
  const {pharmId} = req.params;
  
  const newPrescription = new prescription(req.body);

  const pat = await patient.findById(patId);
  const user = await padmin.findById(pharmId);
  
  newPrescription.patients=pat;
  newPrescription.padmins = user;
  
  await newPrescription.save();

  user.prescriptions=user.prescriptions.concat(newPrescription);
  pat.prescriptions=pat.prescriptions.concat(newPrescription);

  await user.save();
  await pat.save();

      res.send(newPrescription);        
  
},
putpadmin: async(req, res, next) => {
  const {pharmId} = req.params;
  const {patId} = req.params;
  const user = await padmin.findByIdAndUpdate(pharmId,req.body)
  const newPat= await patient.findOneAndUpdate({"_id":patId,"padmin._id":pharmId},{"padmin.$":req.body})
  res.json(200);
},

  removepadmin:async(req, res,next) => {
  const {pharmId} = req.params;
  const {patId} = req.params;
  const user = await padmin.findByIdAndRemove(pharmId)
  const newPat = await patient.findByIdAndUpdate(patId,{$pull:{"padmin":{"_id":pharmId}}})
  res.send(200);
},


putPresp: async(req, res, next) => {
  const {pharmId} = req.params;
  const {patId} = req.params;
  const {presId} = req.params;
  const newPresp = await prescription.findByIdAndUpdate(presId,req.body)

  const user= await padmin.findOneAndUpdate({"_id":pharmId,"prescription._id":presId},{"prescription.$":req.body})

  const newPat = await patient.findOneAndUpdate({"_id":patId,"prescription._id":presId},{"prescription.$":req.body})

  res.json(200);
},

  removePresp:async(req, res,next) => {
  const {pharmId} = req.params;
  const {patId} = req.params;
  const {presId} = req.params;
  const newPresp = await prescription.findByIdAndRemove(presId)
  const admin = await padmin.findByIdAndUpdate(pharmId,{$pull:{"prescription":{"_id":presId}}})
  const admin1 = await patient.findByIdAndUpdate(patId,{$pull:{"prescription":{"_id":presId}}})
  res.send(200);
},

count:(req, res)=> {
  prescribe.count((err, count) => {
    if (err) { return console.error(err); }
    res.status(200).json(count);
  });
},

     
search:(req,res)=>{
  var query = new RegExp('^'+req.body.search,'i');
       
    prescribe.find({
      "$or":[
            {healthissue:{$regex:query}},
            {medicine:{$regex:query}}
           ]},(err, data) => {
           res.json(data);
      });    
          
   }

};