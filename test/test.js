var test = require('tap').test;
var user = require('../lib/user');
var song = require('../lib/song');
var room = require('../lib/room');

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
            name : 'foobar',
            status : 'active'
          }, user).done(function(savedSong) {
            t.ok('foobar', savedSong.get('name'));
            var id = savedSong.id;
            console.log("Song created", id);

            song.save({
              start : 3,
              id : id
            }, user).done(function(updatedSong) {
              t.equal(id, updatedSong.id);

              song.allByUser(user).done(function(songs) {
                console.dir(songs);
                t.ok(songs.length>0);

                room.save({
                  name : "beep"
                }).done(function(roomModel) {

                  room.all().done(function(rooms) {
                    t.ok(rooms.length>0);
                    t.end();
                  });

                });
              });
            });
          });

        });
      })

    })
});