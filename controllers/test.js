module.exports = function (req, res) {
  var viewData = {
        video: req.params.video
      };

  res.render('desktop/test.html', viewData);
};
