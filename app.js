
const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const AppConstants = require('./settings/constants');

let con = mongoose.createConnection(AppConstants.DB_URL);

//app.use('/public', express.static('public')); 
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended:true
}));

require('./model/forum');
require('./model/users');
require('./model/messages');

app.db = {
  forums: con.model('forums'),
  users: con.model('users'),
  messages: con.model('messages')
};

require('./controller/api')(app);

app.listen(3096);
