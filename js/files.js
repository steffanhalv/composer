var createFolder = function(name) {

  return '<li><div class="folder">'+name+'</div></li>'

};

var createFile = function(src, dr, folder) {

  var extension = src.split('.').pop();
  var name = src.replace('.'+extension, '');

  return '<li><div class="file" duration="'+dr+'" file_name="'+name+'" folder="'+folder+'" extension="'+extension+'">'+name+'</div></li>'

};

var fetchFolders = function() {

  $.ajax({
    type: "GET",
    url: "php/get_folders.php",
    dataType: "json",
    cache: false,
    success: function(result){
      $.each(result, function() {
        var folder = createFolder(String(this[0]));
        $('.explorer ul.folders').append(folder);
      });
      initFolders();
    }
  });

};

var fetchFiles = function(folder) {

  $.ajax({
    type: "GET",
    url: "php/get_files.php/?folder="+folder,
    dataType: "json",
    cache: false,
    success: function(result){
      $('.explorer ul.files').html("");
      $.each(result, function() {
        var file = createFile(String(this[0]), this[1], this[2]);
        $('.explorer ul.files').append(file);
      });
      initFiles();
    }
  });

};

var initFiles = function() {

  $(".file").each(function(){

    $( this ).draggable({
      revert: 'invalid',
      snap: '.composer li, .browser-line',
      snapMode: 'inner',
      helper: function(){
        return '<div class="audio track" extension="'+$(this).attr('extension')+'" file_name="'+$(this).attr('file_name')+'" folder="'+$(this).attr('folder')+'" duration="'+Number($(this).attr('duration'))+'" style="width: '+Number($(this).attr('duration'))+'px"><span>'+$(this).attr('file_name')+'</span></div>'
      },
      scroll: false,
      containment: 'window',
      appendTo: 'body',
      cursor: 'move',
      zIndex: 9
    });

  });

};

var initFolders = function() {

  $(".folder").click(function(){

    fetchFiles($(this).html());

  });

};