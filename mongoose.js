
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true})
     .then( () => console.log('connected to MongoDb...'))
     .catch( (e)=> console.error('Could not connect to MongoDb...', e))

const directorySchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: Number,
    country: {type: String, default: 'USA'},
    phone: Number,
    generation: Number,
    familyId: String,
    status: { type: Boolean, default: 'false' }
});

const Directory = mongoose.model('Directory',directorySchema);

module.exports=Directory;