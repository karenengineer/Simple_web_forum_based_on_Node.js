const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let forumSchema = new Schema ({
  body: {
    type: String,
    default: null
  },
  header: {
    type: String,
    default: null
  },
  messages: [{          
    type: Schema.ObjectId,
    ref: 'messages'
  }]
});
module.exports = mongoose.model('forums', forumSchema);
