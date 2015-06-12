var createTrack = function(options) {

  options.type = 'mp3';

  var track = {
    id: options.id,
    track: options.track, //Contains source and extension
    pad: options.pad, //equals to left position
    volume: options.volume, // 0 -> 1
    layer: options.layer //li position
  }

  return track;

};