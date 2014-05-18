$(function () {

var song = null;

$.ajax({
  url : '/ajax/getSongs'
}).done(function(result) {
  if (result.value) {
    song = result.value[0];
  }
  console.log(result);
});

function handleKeyPress () {
  $submit.prop('disabled', !$songName.val());
}

var $songName = $('#song-name'),
    $startTime = $('#start-time'),
    $room = $('#room'),
    $submit = $('#submit');

$songName.on('keyup change', handleKeyPress);

/*$('#submit').click(function() {

  var songToUpdate = {
    "name" : "josh's song"
  };

  if (song) songToUpdate.id = song.objectId;

  $.ajax({
    url : '/ajax/saveSong',
    data : {
      obj : JSON.stringify(songToUpdate)
    }
  })
});*/

});
