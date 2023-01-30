window.addEventListener('load', videoScroll);
window.addEventListener('scroll', videoScroll);

function videoScroll() {

  if ( document.querySelectorAll('video[autoplay]').length > 0) {
    var windowHeight = window.innerHeight,
        video = document.querySelectorAll('video[autoplay]');

    for (var i = 0; i < video.length; i++) {

      var thisVideo = video[i],
          videoHeight = thisVideo.clientHeight,
          videoClientRect = thisVideo.getBoundingClientRect().top;

      if ( videoClientRect <= ( (windowHeight) - (videoHeight*.5) ) && videoClientRect >= ( 0 - ( videoHeight*.5 ) ) ) {
        thisVideo.play();
      } else {
        thisVideo.pause();
      }

    }
  }

}