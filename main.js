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

});

var id = 0;
var createTrackId = function() {
    id++;
    return 'track_'+id;
}