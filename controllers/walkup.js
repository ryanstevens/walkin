var _ = require('underscore'),
    User = require('../lib/user'),
    Song = require('../lib/song'),
    Room = require('../lib/room');

function me (req) {
  if (!req.cookies.wid) throw Error('notauthed');
  return User.getUserFromSession(req.cookies.wid);
}

function getSongs (req) {
  return me(req).pipe(function(user) {
    return Song.allByUser(user);
  });
}

module.exports = function (req, res) {
  var viewParams = {};

  me(req).done(function (user) {
    viewParams.user = user;

    getSongs(req).done(function (songs) {
      if (songs.length) {
        viewParams.song = _.last(songs);
      }

      res.render('desktop/walkup.html', viewParams);
    });
  });
};
