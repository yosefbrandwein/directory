
const mongoose = require('mongoose');


mongoose.connect('mongodb://heroku_1kbpzwdp:kjbc5kmvnau0ivqonpljehg8kp@ds261296.mlab.com:61296/heroku_1kbpzwdp',{ useNewUrlParser: true})
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