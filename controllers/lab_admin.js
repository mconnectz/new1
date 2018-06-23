const Ladmin = require('../schema/lab_admin');
const labreport = require('../schema/labreport');


module.exports = {
  
  getAll:(req, res)=> {
      Ladmin.find({}, (err, docs) => {
        if (err) { return console.error(err); }
        res.status(200).json(docs);
      });
  },
  count:(req, res)=> {
      Ladmin.count((err, count) => {
        if (err) { return console.error(err); }
        res.status(200).json(count);
      });
  },
  insert:(req, res) => {
      const obj = new Ladmin(req.body);
      obj.save((err, item) => {
        if (err && err.code === 11000) {res.sendStatus(400)}
        if (err) {return console.error(err);}
        res.status(200).json(item);
      });
  },
  get:(req, res) => {
      Ladmin.findOne({ _id: req.params.id }, (err, item) => {
        if (err) { return console.error(err); }
        res.status(200).json(item);
      });
  },
  update:(req, res) => {
      Ladmin.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
        if (err) { return console.error(err); }
        res.sendStatus(200);
      });
  },
  remove:(req, res) => {
      Ladmin.findOneAndRemove({ _id: req.params.id }, (err) => {
        if (err) { return console.error(err); }
        res.sendStatus(200);
      });
  },
  search:(req,res)=>{
      
      var query = new RegExp('^'+req.body.search,'i');

      Ladmin.find({
          "$or":[
                  {name:{$regex:query}},
                  {phone:{$regex:query}}
              ]},(err, data) => {
                  res.json(data);
      });    
   
  },
  newlabreport:async(req,res,next)=>{
    const {id} = req.params;
    const newlabreport = new labreport(req.body);
    const admin = await Ladmin.findById(id);
    newlabreport.ladmin= admin;
    await newlabreport.save();
    admin.labreport.push(newlabreport);
    await admin.save()
    res.send(newlabreport);
  },
  getlabreport:(req, res) => {
 
    labreport.find({ ladmin: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      res.status(200).json(item);
    });
  },
  getlabreportbyId: async(req, res, next) =>{
    const {labrid}= req.params;
    const user = await labreport.findById(labrid);
    res.send(user);
   },
/*
   putlabreportbyId: async(req, res, next) =>{
    const{id}=req.params;
    const {labrid} = req.params;
    const labreport = await labreport.findByIdAndUpdate(labrid,req.body);
    const ladmin = await ladmin.findOneAndUpdate({"_id":id,"labreport._id":labrid},{"labreport.$":req.body})
    res.send(200);
 },
 */
 putlabreportbyId: async(req, res, next) =>{
  const {id}= req.params;
   const {labrid} = req.params;
   const lab = await labreport.findByIdAndUpdate(labrid,req.body);
   const ladmin = await Ladmin.findOneAndUpdate({"_id":id,"labreport._id":labrid},{"labreport.$":req.body})
   res.send(200);
},
 deletelabreportbyId: async(req, res, next) =>{
    const {labrid} = req.params;
    const labr = await labreport.findByIdAndRemove(labrid,req.body);
  
    res.send(200);
   },

}