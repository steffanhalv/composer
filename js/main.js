var pause = true;

$(document).ready(function() {

  $( ".explorer" ).resizable({
    handles: "e",
    resize: function(e, ui) {
      $('.composer').css({
        left: $('.explorer').width()
      });
      $('.player').css({
        left: $('.explorer').width()
      });
      $( ".browser-top" ).css({
        left: $('.explorer').width()
      });
      $( ".browser-line" ).css({
        left: $('.explorer').width()
      });
    }
  });

  $( ".composer li" ).droppable({
    accept: ".file",
    drop: function(e, ui) {

      var trackId = createTrackId();
      var width = ui.helper[0].attributes.duration.value;
      $(this).append('<div class="track" id="'+trackId+'" style="width: '+width+'px"><span>'+ui.helper[0].innerHTML+'</span><div id="jp_'+trackId+'"></div></div>');
      $('#'+trackId).css({
        position: 'absolute',
        left: ui.position.left-$('.explorer').width()+$('.composer').scrollLeft()
      }).draggable({
        containment: '.composer ul',
        snap: 'li',
        snapMode: 'inner',
        stop: function() {
          if (!pause) {
            pause = true;

            setTimeout(function() {
              pause = false;
              play();
            }, 500);
          }
        }
      }).resizable({
        handles: "e, w"
      }).attr({
        duration: ui.helper[0].attributes.duration.value
      });

      initjPlayer(trackId, ui.helper[0].innerHTML);

    }
  });

  $( ".composer" ).scroll(function() {
      $( ".browser-top" ).css({
          marginLeft: -$('.composer').scrollLeft()
      });
      $( ".browser-line" ).css({
          marginLeft: -$('.composer').scrollLeft()+10
      });
  });

  $( ".browser-line" ).draggable({
      containment: '.composer ul',
      axis: 'x',
      drag: function(e, ui) {
        $( ".browser-top").css({
            left: $( ".browser-line").position().left
        });
      },
      stop: function(e, ui) {
        $( ".browser-top").css({
            left: $( ".browser-line").position().left
        });

        if (!pause) {
          pause = true;

          setTimeout(function() {
            pause = false;
            play();
          }, 500);
        }
      }
  });

  $( ".browser-top" ).draggable({
      containment: '.composer',
      axis: 'x',
      drag: function(e, ui) {
        $( ".browser-line").css({
            left: $( ".browser-top").position().left
        });
      },
      stop: function(e, ui) {
        $( ".browser-line").css({
            left: $( ".browser-top").position().left
        });
        if (!pause) {
          pause = true;

          setTimeout(function() {
            pause = false;
            play();
          }, 500);
        }
      }
  });

  fetchFiles();

  $('#play').click(function() {
    pause = !pause;
    play();
  });

});

var id = 0;
var createTrackId = function() {
    id++;
    return 'track_'+id;
}



var initjPlayer = function(id, file) {

  $('#jp_'+id).jPlayer({
    ready: function() {
      $(this).jPlayer("setMedia",{
        mp3: 'files/'+file
      });

      $('.browser-line').on('step', function() {

        var currentTime = parseInt(($('.browser-line').position().left-$('.explorer').width()-$('.composer').scrollLeft())-$('#'+id).position().left)+10;

        while(currentTime>$('#'+id).attr('duration')) {
          currentTime = currentTime - $('#'+id).attr('duration');
        }

        if (($('#'+id).position().left-10)<=($('.browser-line').position().left-$('.explorer').width())&&
          ($('.browser-line').position().left-$('.explorer').width())<($('#'+id).position().left-10+$('#'+id).width())
          &&$('#jp_'+id).data().jPlayer.status.paused&&!pause) {

          $('#jp_'+id).jPlayer( "play", currentTime );

        } else if (($('.browser-line').position().left-$('.explorer').width())>($('#'+id).position().left-10+$('#'+id).width())) {

          $('#jp_'+id).jPlayer( "pause" );

        } else if (pause) {
          $('#jp_'+id).jPlayer( "pause" );
        }
      });

    },
    swfPath: 'js/libraries/jquery.jplayer.swf',
    loop: true,
    solution:"flash,html"
  });

};

var play = function() {

  if (!pause) {

    $('.browser-line').css({
      left: $('.browser-line').position().left+0.25
    });

    $('.browser-top').css({
      left: $('.browser-top').position().left+0.25
    });

    $('.browser-line').trigger('step');

    setTimeout(function () {
      play();
    }, 250);
  } else {
    $('.browser-line').trigger('step');
  }

}

var exportTimeline = function() {

  var tracks = [];

  $('.track').each(function() {
    var track = {
      source: $(this).find('span').html(),
      pad: $(this).position().left-10
    };

    tracks.push(track);

  });

  $.ajax({
    type: 'POST',
    url: 'php/export_timeline.php',
    data: JSON.stringify(tracks),
    success: function(msg) {
      console.log(msg);
    }
  });

};