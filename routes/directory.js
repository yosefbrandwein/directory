const express = require('express');
const router = express.Router();
const Directory=require('../mongoose.js')


//route to address book 
router.get('/', async (req, res) => {
  
  try {
    const addresses = await Directory
    .find()
    .sort({ lastName: 1 })
    .select({firstName: 1, lastName: 1, address: 1, city: 1, state: 1, zip: 1});
            
    res.render('index',{directory: addresses});
  } catch (error) {
    console.log('error', error.message);
  }
  
});


//route to specific address 
router.get('/search',async (req, res) => {
  
 
   const first= (req.query.firstName) ? req.query.firstName.toUpperCase() : null;
   const last = (req.query.lastName) ? req.query.lastName.toUpperCase() : null;
   let address;
  try {
    if (first!==null && last!==null) {
       address = await Directory
      .find({firstName: first, lastName: last})
      .select({firstName: 1, lastName: 1, address: 1, city: 1, state: 1, zip: 1 });  
    }
    
    else {
       address = await Directory
      .find({ $or:[
          {firstName : new RegExp(first)},{ lastName: new RegExp(last)} 
        ]})
      .select({firstName: 1, lastName: 1, address: 1, city: 1, state: 1, zip: 1 });
      }

    if (address.length===0)
      res.status(404).render('response',{message:'Sorry no such family member'});
    else{
      res.render('index',{directory: address});
    }
  } catch (e) {
      console.log('Error', e.message);
  }
});
/*
router.delete('/:id', function (req, res) {
    //address.deleteOne/Many
    //working on it
});
  //update member
router.update('/:id', function (req, res) {
    //check if exist
    //address.set({
    //  address.firstName=req....
    //})
    //working on it
    //address.save 
    //res.send(address)
    //second approch address.update
});
*/

router.post('/newmember',async function (req, res) {
  try {
  
  const first= req.body.firstName.toUpperCase();
  const last = req.body.lastName.toUpperCase();

  const check = await Directory
    .find()
    .select({firstName: 1, lastName: 1});

  const member= check.find( m => m.firstName===first && m.lastName===last);
  if (member) 
    
    return res.render('response',{message: `${first} ${last} alredy exist in directory`});  
      
  async function createMember () {
  
    const member =  new Directory({
      firstName: req.body.firstName.toUpperCase(),
      lastName: req.body.lastName.toUpperCase(),
      address: req.body.address.toUpperCase(),
      city: req.body.city.toUpperCase(),
      state: req.body.state.toUpperCase(),
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      generation: req.body.generation,
      familyId: req.body.familyId,
      status: req.body.status
    });
    
    const result = await member.save();
    res.render('response',{message:`${result.firstName} was successfully added to the directory.`});
  }
  createMember();
  } 
  catch (e) {
    console.log('Error', e.message);
  }
      
});


module.exports=router;