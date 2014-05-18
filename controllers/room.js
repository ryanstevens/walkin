function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = function (req, res, template, viewData) {
  var app = this,
      route = req.params.route || 'home';

  template = template || app.locals.templateMap.room;
  viewData = viewData || { title: capitalize(route) };

  res.render(template, viewData);
};
