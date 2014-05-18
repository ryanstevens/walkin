$(function () {

function playVideo (videoId) {
  $container
    .empty()
    .html('<iframe width="560" height="315" ' +
      'src="//www.youtube.com/embed/' + videoId +
      '?autoplay=1" frameborder="0" allowfullscreen></iframe>');
}

var $container = $('.video-container');

playVideo(walkup.video);

});
