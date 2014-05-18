var test = require('tap').test;
var user = require('../lib/user');
var song = require('../lib/song');

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

      user.makeSession(userModel.id).done(function(session) {

        user.getUserFromSession(session.id).done(function(user) {
          t.equal("10152017615725566", user.get('fb_user_id'));

          song.save({
            name : 'foobar'
          }).done(function(song) {
            t.ok('foobar', song.get('name'));
            t.end();
          });

        });
      })

    })
});