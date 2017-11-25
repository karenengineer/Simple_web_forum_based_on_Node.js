const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessagesSchema = new Schema ({
  content: String,
  author: {
    type: Schema.ObjectId,
    ref: 'users'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

MessagesSchema.index({created: -1});
module.exports = mongoose.model('messages', MessagesSchema);
