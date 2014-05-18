var test = require('tap').test;
var user = require('../lib/user');

test('Parse', function(t) {

  user.createUser({
    first_name: "Ryan"
    ,gender: "male"
    ,fb_user_id: "10152017615725566"
    ,last_name: "Stevens"
    ,link: "https://www.facebook.com/app_scoped_user_id/10152017615725566/"
    ,locale: "en_US"
    ,name: "Ryan Stevens"
    ,timezone: -7
    ,updated_time: "2014-02-07T18:41:55+0000"
    , verified: true}).done(function(userModel) {

      user.makeSession(userModel).done(function(session) {

        user.getUserFromSession(session.id).done(function() {
          console.log("Session", session.id);
        });
      })

    })
});