var createFile = function(src, dr) {

  return '<li><div class="file" duration="'+dr+'" extension="'+src.split('.').pop()+'">'+src+'</div></li>'

};

var appendFile = function(file) {
  $('.explorer ul').append(file);
};

var fetchFiles = function() {

  $.ajax({
    type: "GET",
    url: "php/get_files.php",
    dataType: "json",
    cache: false,
    success: function(result){
      $.each(result, function() {
        var file = createFile(String(this[0]), this[1]);
        appendFile(file);
      });
      initFiles();
    }
  });

};

var initFiles = function() {

  $(".file").each(function(){

    var name = $(this).html();

    $( this ).draggable({
      revert: 'invalid',
      snap: '.composer li',
      snapMode: 'inner',
      helper: function(){
        return '<div class="audio track" duration="'+Number($(this).attr('duration'))+'" style="width: '+Number($(this).attr('duration'))+'px">'+name+'</div>'
      },
      containment: 'document',
      cursor: 'move'
    });

  });

};