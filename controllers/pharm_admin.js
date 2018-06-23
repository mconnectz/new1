
const Medicine = require('../schema/medicine');
const Padmin=require('../schema/pharm_admin');

module.exports = {
  
  getAll:(req, res)=> {
      Padmin.find({}, (err, docs) => {
        if (err) { return console.error(err); }
        res.status(200).json(docs);
      });
  },
  count:(req, res)=> {
      Padmin.count((err, count) => {
        if (err) { return console.error(err); }
        res.status(200).json(count);
      });
  },
  insert:(req, res) => {
      const obj = new Padmin(req.body);
      obj.save((err, item) => {
        if (err && err.code === 11000) {res.sendStatus(400)}
        if (err) {return console.error(err);}
        res.status(200).json(item);
      });
  },
  get:(req, res) => {
      Padmin.findOne({ _id: req.params.id }, (err, item) => {
        if (err) { return console.error(err); }
        res.status(200).json(item);
      });
  },
  update:(req, res) => {
      Padmin.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
        if (err) { return console.error(err); }
        res.sendStatus(200);
      });
  },
  remove:(req, res) => {
      Padmin.findOneAndRemove({ _id: req.params.id }, (err) => {
        if (err) { return console.error(err); }
        res.sendStatus(200);
      });
  },
  search:(req,res)=>{
      
      var query = new RegExp('^'+req.body.search,'i');

      Padmin.find({
          "$or":[
                  {name:{$regex:query}},
                  {phone:{$regex:query}}
              ]},(err, data) => {
                  res.json(data);
      });    
   
  },
  newmedicine:async(req,res,next)=>{
    const {id} = req.params;
    const newMedicine = new Medicine(req.body);
    const admin = await Padmin.findById(id);
    newMedicine.padmin= admin;
    await newMedicine.save();
    admin.medicine.push(newMedicine);
    await admin.save()
    res.send(newMedicine);
  },
  getmedicine:(req, res) => {
 
    Medicine.find({ padmin: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  },
  getmedicinebyId: async(req, res, next) =>{
    const {medid}= req.params;
    const user = await Medicine.findById(medid);
    res.send(user);
   },
   putmedicinebyId: async(req, res, next) =>{
   const{id}=req.params;
    const {medid} = req.params;
    const medicine = await Medicine.findByIdAndUpdate(medid,req.body);
    const padmin = await Padmin.findOneAndUpdate({"_id":id,"medicine._id":medid},{"medicine.$":req.body})
    res.send(200);
 },
 deletemedicinebyId: async(req, res, next) =>{
    const {medid} = req.params;
    const medi = await Medicine.findByIdAndRemove(medid,req.body);
  
    res.send(200);
   },

}