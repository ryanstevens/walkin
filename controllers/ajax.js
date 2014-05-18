var Deferred = require('Deferred'),
  User = require('../lib/user');


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
  me : function(req, res, dfd) {
    if (!req.cookies.wid) return dfd.resolve({ error : 'goaway'});
    return User.getUserFromSession(req.cookies.wid);
  }
};


module.exports = function (req, res) {
  var app = this,
    action = req.params.action;

  var dfd = Deferred();
  actions[action](req, res, dfd).done(function(result) {
    res.json(result);
    res.end();
  });
};
