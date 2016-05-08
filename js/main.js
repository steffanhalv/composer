var pause = true;

$(document).ready(function() {

    $( ".timeline" ).resizable({
        handles: "e",
        containment: "parent"
    });

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

  $( ".top-line" ).click(function(e) {
    $( ".browser-top" ).css('left', e.offsetX+$('.explorer').width()-10+'px');
    $( ".browser-line" ).css('left', e.offsetX+$('.explorer').width()-10+'px');
  });

  $( ".composer" ).scroll(function() {
    $( ".top-line").css({
      marginTop: $( this ).scrollTop()
    });
    $( ".composer ul").css({
      marginTop: -$( this ).scrollTop()
    });
  });

  $( ".composer li" ).droppable({
    accept: ".file",
    drop: function(e, ui) {

      var trackId = createTrackId();
      var width = ui.helper[0].attributes.duration.value;
      $(this).append('<div class="track" id="'+trackId+'" style="width: '+width+'px"><span>'+ui.helper[0].innerHTML+'</span><div id="jp_'+trackId+'"></div></div>');

      $('#'+trackId).attr('pos_left', 0).attr('pos_right', 0);
      var widthStart = 0;
      var widthEnd = 0;
      $('#'+trackId).css({
        position: 'absolute',
        left: ui.position.left-$('.explorer').width()+$('.composer').scrollLeft()
      }).draggable({
        containment: '.composer ul',
        snap: '.composer li, .browser-line',
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
        handles: "e, w",
        start: function(e, ui) {

          widthStart = $(this).width();

          if (e.toElement.className.indexOf("ui-resizable-w") >= 0) {

            $(this).css({
              maxWidth: $(this).width() + Number($(this).attr('pos_left'))
            });

          } else {

            $(this).css({
              maxWidth: $(this).width() + Number($(this).attr('pos_right'))
            });

          }

        },
        stop: function(e, ui) {

          widthEnd = $(this).width();

          if (e.toElement.className.indexOf("ui-resizable-w") >= 0) {

            var pos_left = Number($('#'+trackId).attr('pos_left'))+(widthStart-widthEnd)
            $('#'+trackId).attr('pos_left', pos_left);

          } else {

            var pos_right = Number($('#'+trackId).attr('pos_right'))+(widthStart-widthEnd)
            $('#'+trackId).attr('pos_right', pos_right);

          }

        }
      }).attr({
        duration: ui.helper[0].attributes.duration.value,
        folder: ui.helper[0].attributes.folder.value
      }).mousedown(function() {

        $('.track').removeClass('selected');
        $(this).addClass('selected');

      });

      console.log(ui.helper[0].attributes);

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
      snap: '.track',
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

  fetchFolders();

  $('#play').click(function() {
    pause = !pause;
    play();
  });

  $(document).keydown(function(e) {

    console.log(e.which);

    if (e.which == 32) {
      pause = !pause;
      play();
    }

    if (e.which == 46) {
      removeSelected();
    }

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
        mp3: 'files/'+$('#'+id).attr('folder')+'/'+file
      });

      $('.browser-line').on('step', function() {

        if (typeof $('#'+id).position()!=='undefined') {

          var currentTime = $('.browser-line').position().left - $('.explorer').width() - $('.composer').scrollLeft() - $('#' + id).position().left + 10 + Number($('#' + id).attr('pos_left'));

          if (currentTime > 0 && currentTime < $('#' + id).width() + Number($('#' + id).attr('pos_left')) &&
            $('#jp_' + id).data().jPlayer.status.paused && !pause) {

            $('#jp_' + id).jPlayer("play", currentTime);

          } else if (currentTime < Number($('#' + id).attr('pos_left'))) {

            $('#jp_' + id).jPlayer("pause");

          } else if (currentTime > Number($('#' + id).attr('pos_left')) + $('#' + id).width()) {

            $('#jp_' + id).jPlayer("pause");

          } else if (pause) {

            $('#jp_' + id).jPlayer("pause");

          }
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

var exportTimeline = function(ext) {

  var tracks = [];

  $('.track').each(function() {
    var track = {
      source: $(this).find('span').html(),
      pad: $(this).position().left-10,
      trim: $(this).attr('pos_left'),
      duration: $(this).width(),
      folder: $(this).attr('folder'),
      extension: ext
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

var removeSelected = function() {

  $('.selected').remove();

};