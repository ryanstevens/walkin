var request = require('request'),
    Deferred = require('Deferred'),
    _ = require('underscore'),
    // TODO: implement API calls using request
    api = {
      lookupTrack: function(query) {
        var dfd = Deferred();
        request({
          uri: 'https://partner.api.beatsmusic.com/v1/api/search?q=' + encodeURIComponent(query) + '&type=track&client_id=' + process.env.BEATS_CLIENTID,
          json: true
        }, function(err, data) {
          if (err) {
            dfd.reject(err);
          } else {
            dfd.resolve(findFirstTrack(data));
          }
        })
        return dfd.promise();
      }
      
    };

function findFirstTrack(data) {
  var record;
  if (data.body && data.body.data.length) {
    record = data.body.data.shift();

    while (record && record.result_type !== 'track') {
      record = data.body.data.shift();
    }

    return record;
  } else {
    return {
      error: 'No tracks found'
    };
  }
}

module.exports = api;