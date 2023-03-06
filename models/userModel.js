const mongoose = require('mongoose');


const userModel = new mongoose.Schema({
    name: String,
    email: String,
    number:String,
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }
   
})


var user = mongoose.model('User', userModel);

module.exports = user;