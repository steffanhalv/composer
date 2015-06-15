<?php

error_reporting(0);

$json_output = json_decode(file_get_contents("php://input"), true);

$cmd = "sox -m ";

function addFile($cmd, $file, $pad, $trim, $duration, $folder) {

    $dir = "../files/".$folder."/";
    $cmd = $cmd.'"|sox '.$dir.$file.' -p pad '.$pad.' 0 trim '.$trim.' '.$duration.'" ';
    //$cmd = $cmd.'"|sox '.$dir.$file.' -p pad '.$pad.' 0" ';
    return $cmd;

}

$ext = 'mp3';

foreach ($json_output as $trend){
    $cmd = addFile($cmd, $trend['source'], $trend['pad'], $trend['trim'], $trend['duration'], $trend['folder']);
    $ext = $trend['extension'];
}

$cmd = $cmd."../files/result.".$ext;

$result = shell_exec($cmd);

echo $cmd;

?>