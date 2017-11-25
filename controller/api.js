const crypto = require('crypto');

const Utility = require('./../services/utility');
const AppConstants = require('./../settings/constants');
const UserValidator = require('./../services/validators/user_validator');

const ET = Utility.ErrorTypes;  //for short code

module.exports = function(app) {
  function _auth(permission){    //middleware
    return function (req,res,next) {
      if (permission === 'user') {
        app.db.users.findOne({key: req.query.key},(err,user) => {
          if (!user) {
            return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
          }
          req.user = user;
          return next();
        });
      }
      if (permission === 'optional') {
        return next();
      }
    }
  } // _auth scope

  app.post('/api/forums', _auth('user'), (req,res) => {  // post request for forum creation
    if (!req.body.body  || !req.body.header) {
      return res.send(Utility.generateErrorMessage(ET.EMPTY_ERROR));
    }
    app.db.forums.create({body:req.body.body,header:req.body.header}, (err,data) => {
      if (err) {
        return res.send('error');
      }
      return res.send(data);
    });
  }); //forum post scope

  app.post('/api/users',_auth('optional'), (req, res) => {  // request for user creation
    let username = req.body.username;
    let password = req.body.password;
    let uv_response = UserValidator.validateUsername(username);
    if(uv_response != Utility.ErrorTypes.SUCCESS) {
      return res.send(Utility.generateErrorMessage(uv_response));
    }
    if (!username) {
      return res.send(Utility.generateErrorMessage(ET.USERNAME_EMPTY));
    }
    if (username.length < AppConstants.USERNAME_MIN_LENGTH
      || username.length > AppConstants.USERNAME_MAX_LENGTH) {
        return res.send(Utility.generateErrorMessage(ET.INVALID_USERNAME_RANGE));
      }
      if (!password) {
        return res.send(Utility.generateErrorMessage(ET.PASSWORD_EMPTY));
      }
      if (password.length < AppConstants.PASSWORD_MIN_LENGTH
        || password.length > AppConstants.PASSWORD_MAX_LENGTH) {
          return res.send(Utility.generateErrorMessage(ET.INVALID_PASSWORD_RANGE));
        }
        password = crypto.createHash('sha1').update(password + 'salt').digest('hex');
        app.db.users.findOne({username:username}, (err, data) => {
          if(data) {
            return res.send('user already exist.');
          }
        });
        app.db.users.create({
          username: username,
        }, (err, data) => {
          if (err) {
            return res.send(Utility.generateErrorMessage(ET.USER_CREATION_ERROR));
          }
          return res.send(data);
        });
      }); // user post scope

      app.post('/api/forums/:id/messages', _auth('user'), (req, res) => {  // post request for message creation
        let src_forum = null;
        app.db.forums.findOne({_id: req.params.id}).then(forum => {
          if (!forum) {
            return res.send(Utility.generateErrorMessage(ET.FORUM_NOT_FOUND));
          }
          src_forum = forum;
          return app.db.messages.create({
            content: req.body.content,
            author: req.user._id
          });
        }).then(message => {
          src_forum.messages.addToSet(message._id);
          return src_forum.save();
        }).then(forum => {
          return res.send(forum);
        });
      }); //message post scope

      app.get('/api/forums',_auth('user'),(req, res) => {  // request for getting forum  list
        let offset = parseInt(req.query.offset);
        if (!isFinite(offset)) offset = AppConstants.OFFSET_DEFAULT_VALUE;
        let limit = parseInt(req.query.limit);
        if (!isFinite(limit)) limit = AppConstants.LIMIT_DEFAULT_VALUE;
        app.db.forums.find({}, (err, data) => {
          if (err) {
            return res.send('error');
          }
          return res.send(data).skip(offset).limit(limit).sort({created: -1});
        });
      }); // get forums list scope

      app.get('/api/forums/:id',_auth('user'),(req, res) => { // request for  getting  forum by id
        app.db.forums.findOne({_id:req.params.id}, (err, data) => {
          /*  if (!_id) {
          return res.send(Utility.generateErrorMessage(ET.ID_ERROR));
        }*/
        if (err) {
          return res.send('error');
        }
        return res.send(data);
      });
    }); // get forum scope

    app.get('/api/users', _auth('user'),(req, res) => { // request for getting user by key
      if(!req.query.key){
        return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED))
      }
      app.db.users.find({key:req.query.key},(err,data) => {
        if(err){
          return res.send('not found');
        }
        let response = data.map(d => {
          return {
            username: d.username,
            password: d.password,
            key: d.key,
          }
        });
        res.send(response);

      });
    }); // user get scope

    app.get('/api/forums/:id/messages', _auth('optional'), (req, res) => { // request for getting messages about forum
      let offset = parseInt(req.query.offset);
      if (!isFinite(offset)) offset = AppConstants.OFFSET_DEFAULT_VALUE;
      let limit = parseInt(req.query.limit);
      if (!isFinite(limit)) limit = AppConstants.LIMIT_DEFAULT_VALUE;
      app.db.forums.findOne({_id: req.params.id}).then(forum => {
        if (!forum) {
          return res.send(Utility.generateErrorMessage(ET.FORUM_NOT_FOUND));
        }
        return app.db.messages.find({_id: forum.messages}).skip(offset).limit(limit).sort({created: -1})
      }).then(messages => {
        return res.send(messages);
      }).catch(err => res.send(err));
    }); // get messages scope

    app.delete('/api/forums/:id',_auth('user'), (req,res) => {    //    delete request for forum by id
      app.db.forums.findOneAndRemove({_id:req.params.id}, (err,data) => {
        /*  if (!_id) {
        return res.send(Utility.generateErrorMessage(ET.USER_ID_ERROR));
      }*/
      if (err) {
        return res.send('error');
      }
      return res.send(data);
    });
  }); // delete forum by id scope

  app.delete('/api/users/:id', _auth('user'),(req,res) => {         // delete request by key for user
    if(!req.query.key){
      return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED))
    }
    app.db.users.findOne({key: req.query.key, role:'user'},(err, user)=> {
      if(err || !user){
        return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
      }
    });
    let id = req.params.id;
    if(!id) {
      return res.send(Utility.generateErrorMessage(ET.USER_ID_ERROR));
    }
    app.db.users.findOneAndRemove({_id: id}, (err,data)=> {
      if(err) {
        return res.send(Utility.generateErrorMessage(ET.USER_DELETE_ERROR));
      }
      return res.send(data);
    });
  }); // delete users scope

  app.delete('/api/forums/:id/messages',_auth('user'),(req,res) => { // delete request for messages by id
    app.db.forums.findOne({_id: req.params.id}).then(forum => {
      if (!forum) {
        return res.send(Utility.generateErrorMessage(ET.FORUM_NOT_FOUND));
      }
      return app.db.messages.findOneAndRemove({_id:req.params.id},(err,data) => {
        if (err) {
          return res.send('error');
        }
        return res.send(data);
      });
    });
  }); //delete messages scope

  app.put('/api/forums/:id',_auth('user'), (req,res) => { // request for editing forum by id
    app.db.forums.findOne({_id:req.params.id},(err,data)=>{
      if (err) {
        return res.send('not data');
      }
      let body = req.body.body;
      let header = req.body.header;
      if (!body) {
        body = data.body;
      }
      if(!header) {
        header = data.header;
      }
      if (!req.body.body  || !req.body.header) {
        return res.send(Utility.generateErrorMessage(ET.EMPTY_ERROR));
      }
      app.db.forums.update({_id:req.params.id},{$set:{body:body,header:header}}, (err,data) => {
        if (err) {
          return res.send('error');
        }
        return res.send(data);
      });
    });
  }); // edit forums scope

  app.put('/api/users/:id', _auth('user'), (req,res)=>{ // request for editing user by id
    if(req.user.role != 'user') {
      if(res.send.id != req.user._id) {
        return res.send(Utility.generateErrorMessage(ET.PERMISSION_DENIED));
      }
    }
    let id = req.params.id;
    let user = {
      username : req.body.username,
      password : req.body.password,
    }
    if(!id){
      return res.send(Utility.generateErrorMessage(ET.USER_ID_ERROR))
    }
    app.db.users.findByIdAndUpdate(id,{$set: req.body},(err,data) => {
      if(err){
        return res.send('error');
      }
      return res.send(data);
    });
  }); // edit user scope


} // module exports scope
