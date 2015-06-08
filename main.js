$(document).ready(function() {

  console.log('jQuery loaded');
  $( ".explorer" ).resizable({
    handles: "e",
    resize: function(e, ui) {
      $('.composer').css({
        left: $('.explorer').width()
      });
      $('.player').css({
        left: $('.explorer').width()
      });
    }
  });

});