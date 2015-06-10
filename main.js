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

        console.log(ui.helper[0]);

          var trackId = createTrackId();
          $(this).append('<div class="track" id="'+trackId+'">'+ui.helper[0].innerHTML+'</div>');
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

});

var id = 0;
var createTrackId = function() {
    id++;
    return 'track_'+id;
}

var listFiles = function() {

  $.ajax({
    type: "GET",
    url: "functions/get_files.php",
    dataType: "json",
    cache: false,
    success: function(result){
      $.each(result, function() {
        $('.explorer ul').append('<li><div class="audio">'+String(this)+'</div></li>');
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
        return '<div class="track">'+name+'</div>'
      },
      containment: 'document',
      cursor: 'move'
    });

  });

};