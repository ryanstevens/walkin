$(function () {

  var socket = io.connect('/');
  walkup.connected = $.Deferred();

  function checkState () {
    $submit.prop('disabled', (
      $songName.val().length === 0 || 
      $startTime.val().length === 0 || 
      isSaving === true || 
      walkup.connected.state() != 'resolved'
    ));
  }

  var $songName = $('#song-name'),
      $startTime = $('#start-time'),
      $room = $('#room'),
      $submit = $('#submit'),
      isSaving = false;

  $('input').on('keyup change', checkState);

  $submit.click(function() {

    walkup.song.title = $songName.val();
    walkup.song.starttime = $startTime.val();

    isSaving = true;
    checkState();
    $.ajax({
      url : '/ajax/saveSong',
      data : {
        obj : JSON.stringify(walkup.song)
      }
    }).always(function() {
      isSaving = false;
      checkState();
    })

    walkup.connected.done(function() {
      socket.emit('enterRoom', {
        roomId : $('#room option:selected').val(),
        song : walkup.song, 
        user : {
          name : walkup.user.first_name + ' ' + walkup.user.last_name,
          fb_user_id : walkup.user.fb_user_id
        }
      });
    });
  });


  $.ajax({
    url : '/ajax/getAllRooms'
  }).done(function(result) {
    if (result.value) {
      var rooms = result.value;
      rooms.forEach(function(room) {
        $room.append(
            $('<option></option>').val(room.objectId).html(room.name)
        );
      });
    }
    console.log("Rooms::", result);
  });


  socket.on('connect', function (data) {
    if (data && data.state === 'ready') walkup.connected.resolve(data.state);
  });

  walkup.connected.done(function(state) {
    console.log("Connected", state);
    checkState();
  });


  checkState();
});
