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
        }
    });

    $( ".audio" ).draggable({
        revert: 'invalid',
        helper: function(){
            return '<div class="track">Track</div>'
        },
        containment: 'document',
        cursor: 'move'
    });

    $( ".composer td" ).droppable({
        accept: ".audio",
        drop: function(e, ui) {
            var trackId = createTrackId();
            $(this).append('<div class="track" id="'+trackId+'">Track</div>');
            $('#'+trackId).css({
                position: 'absolute',
                left: ui.position.left-$('.explorer').width()+$('.composer').scrollLeft()
            }).draggable({
                containment: '.composer',
                grid: [ 1, 20 ]
            }).resizable({
                handles: "e, w"
            });
        }
    });

});

var id = 0;
var createTrackId = function() {
    id++;
    return 'track_'+id;
}