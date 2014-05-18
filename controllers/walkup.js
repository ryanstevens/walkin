var _ = require('underscore'),
    User = require('../lib/user'),
    Song = require('../lib/song'),
    Room = require('../lib/room');

function me (req) {
  if (!req.cookies.wid) throw Error('notauthed');
  return User.getUserFromSession(req.cookies.wid);
}

module.exports = function (req, res) {
  var viewParams = {
    user : {},
    song : {},
    rooms : []
  };

  me(req).done(function (user) {
    viewParams.user = user;

    Song.allByUser(user).done(function (songs) {
      if (songs.length) {
        var song = _.last(songs);
        viewParams.song = {
          id : song.id,
          title : song.get('name'),
          starttime: song.get('starttime')
        };
      }

      res.render('desktop/walkup.html', viewParams);

    });
  }).fail(function() {
    res.redirect(301, '/signup');
  }); 
};