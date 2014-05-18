var room = require('../lib/room');

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = function (req, res, template, viewData) {
  var app = this,
      route = req.params.route || 'home';

  template = template || app.locals.templateMap.room;
  viewData = viewData || { title: capitalize(route) };

  room.getBySlug(req.params.name).done(function(room) {
    if (!room) {
      res.redirect(301, '/rooms');
      return;
    }
    viewData.room = room;
    viewData.app = {
      clientId: process.env.BEATS_CLIENTID,
      // secret: process.env.BEATS_SECRET,
      accessToken: req.user.accessToken
    }
    viewData.profile = req.user.profile;
    res.render(template, viewData);
  });
};
