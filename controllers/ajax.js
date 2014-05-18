var Deferred = require('Deferred'),
  User = require('../lib/user'),
  Song = require('../lib/song');


var actions = {
  register : function(req, res, dfd) {

    var user = JSON.parse(req.query.obj);
    User.createUser(user).done(function(user) {
      console.log("Created user " + user.id, user);
      User.makeSession(user.id).done(function(session) {
        res.cookie('wid', session.id);
        dfd.resolve(session.id)
      });
    });

    return dfd.promise();
  },
  me : function(req) {
    if (!req.cookies.wid) throw Error('notauthed');
    console.log("Checking for session::" + req.cookies.wid)
    return User.getUserFromSession(req.cookies.wid);
  },
  saveSong : function(req, res, dfd) {
    return Song.save(JSON.parse(req.query.obj));
  },
  getSongs : function(req) {
    return this.me(req).pipe(function(user) {
      return Song.allByUser(user);
    });
  }
};


module.exports = function (req, res) {
  var app = this,
    action = req.params.action;

  var dfd = Deferred();
  try {  
    actions[action](req, res, dfd).done(function(result) {
      res.json({
        result : 'ok',
        value : result
      });
      res.end();
    }).fail(function(error) {
      res.json({
        result : 'error',
        error : error
      });
      res.end();
    });
  }
  catch(e) {
    res.json({
      result : 'error',
      error : e.message
    });
  }
};
