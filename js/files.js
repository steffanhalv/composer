var createFile = function(src) {

  var file = {
    source: src,
    extension: options.src.split('.').pop(),
    html: '<li><div class="file">'+src+'</div></li>'
  };

  return file;

};

var fetchFiles = function() {

  $.ajax({
    type: "GET",
    url: "php/get_files.php",
    dataType: "json",
    cache: false,
    success: function(result){
      $.each(result, function() {
        var file = createFile();
        appendFile();
        $('.explorer ul').append('<li><div class="audio" _length="'+this[1]+'">'+String(this[0])+'</div></li>');
      });
      initFiles();
    }
  });

};

var appendFile = function(file) {
  $('.explorer ul').append(file.html);
};

var initFiles = function() {

  $(".audio").each(function(){

    var name = $(this).html();

    $( this ).draggable({
      revert: 'invalid',
      snap: '.composer li',
      helper: function(){
        return '<div class="audio track" _length="'+Number($(this).attr('_length'))+'" style="width: '+Number($(this).attr('_length'))+'px">'+name+'</div>'
      },
      containment: 'document',
      cursor: 'move'
    });

  });

};