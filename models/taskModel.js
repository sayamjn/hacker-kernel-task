const mongoose = require('mongoose');


const taskModel = new mongoose.Schema({
    task: [String],
    type: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
   
})

var task = mongoose.model('Task', taskModel);

module.exports = task;
