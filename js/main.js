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

  $( ".composer td" ).droppable({
      accept: ".audio",
      drop: function(e, ui) {

          var trackId = createTrackId();
          var width = ui.helper[0].attributes._length.value;
          $(this).append('<div class="track" id="'+trackId+'" style="width: '+width+'px">'+ui.helper[0].innerHTML+'<div id="jp_'+trackId+'"></div></div>');
          $('#'+trackId).css({
              position: 'absolute',
              left: ui.position.left-$('.explorer').width()+$('.composer').scrollLeft()
          }).draggable({
              containment: '.composer',
              grid: [ 1, 20 ]
          }).resizable({
              handles: "e, w"
          }).attr({
              source: 'test'
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
      containment: '.composer',
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
      }
  });

  listFiles();

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

var listFiles = function() {

  $.ajax({
    type: "GET",
    url: "php/get_files.php",
    dataType: "json",
    cache: false,
    success: function(result){
      $.each(result, function() {
        $('.explorer ul').append('<li><div class="audio" _length="'+this[1]+'">'+String(this[0])+'</div></li>');
      });
      initFiles();
    }
  });

};

var initFiles = function() {

  $(".audio").each(function(){

    var name = $(this).html();

    $( this ).draggable({
      revert: 'invalid',
      helper: function(){
        return '<div class="track" _length="'+Number($(this).attr('_length'))+'" style="width: '+Number($(this).attr('_length'))+'px">'+name+'</div>'
      },
      containment: 'document',
      cursor: 'move'
    });

  });

};

var initjPlayer = function(id, file) {

  $('#jp_'+id).jPlayer({
    ready: function() {
      $(this).jPlayer("setMedia",{
        mp3: 'files/'+file
      });

      $('.browser-line').on('step', function() {

        var currentTime = parseInt(($('.browser-line').position().left-$('.explorer').width())-$('#'+id).position().left);

        if ($('#'+id).position().left<=($('.browser-line').position().left-$('.explorer').width())&&
          ($('.browser-line').position().left-$('.explorer').width())<($('#'+id).position().left+$('#'+id).width())
          &&$('#jp_'+id).data().jPlayer.status.paused&&!pause) {

          $('#jp_'+id).jPlayer( "play", currentTime );

        } else if (($('.browser-line').position().left-$('.explorer').width())>($('#'+id).position().left+$('#'+id).width())) {

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