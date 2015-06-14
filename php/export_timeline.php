<?php

error_reporting(0);

$json_output = json_decode(file_get_contents("php://input"), true);

$cmd = "sox -m ";

function addFile($cmd, $file, $pad, $trim, $duration) {

    $dir = "../files/";
    $cmd = $cmd.'"|sox '.$dir.$file.' -p pad '.$pad.' 0 trim '.$trim.' '.$duration.'" ';
    //$cmd = $cmd.'"|sox '.$dir.$file.' -p pad '.$pad.' 0" ';
    return $cmd;

}

foreach ($json_output as $trend){
    $cmd = addFile($cmd, $trend['source'], $trend['pad'], $trend['trim'], $trend['duration']);
}

$cmd = $cmd."../files/result.mp3";

$result = shell_exec($cmd);

echo $cmd;

?>