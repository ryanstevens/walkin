var Deferred = require('Deferred'),
    User = require('../lib/user'),
    Song = require('../lib/song'),
    Room = require('../lib/room'),
    beats = require('../lib/beats');


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
    return this.me(req).pipe(function(user) {
      var songJSON = JSON.parse(req.query.obj);
      console.log("Saving Song::", songJSON);
      return Song.save(songJSON, user);
    });
  },
  getSongs : function(req) {
    return this.me(req).pipe(function(user) {
      return Song.allByUser(user);
    });
  },
  saveRoom :function(req, res, dfd) {
    var roomJSON = JSON.parse(req.query.obj);
    console.log("Saving Room::", roomJSON);
    return Room.save(roomJSON);
  },
  getAllRooms : function() {
    return Room.all();
  },
  lookuptrack: function(req, res) {
    return beats.lookupTrack(req.query.song);
  }
};


module.exports = function (req, res) {
  var app = this,
    action = req.params.action;

  var dfd = Deferred();
  try {  
    req.session = null;
    actions[action](req, res, dfd).done(function(result) {
      console.log("Action complete::"+ action, result);
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
