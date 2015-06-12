<?php
$dir          = "../files/";
$files = array();

if(is_dir($dir)){

    if($dh = opendir($dir)){
        while(($file = readdir($dh)) != false){

            if($file == "." or $file == ".." or $file == ".DS_Store"){

            } else {

                $result = shell_exec('soxi -D '.$dir.$file);

                $new_file = array();

                $new_file[] = $file;
                $new_file[] = $result;

                $files[] = $new_file; // Add the file to the array
            }
        }
    }

    //EXPORT EXAMPLE sox -m "|sox fireflies.mp3 -p pad 6 0" "|sox times.mp3 -p pad 8 0" outputO.mp3

    echo json_encode($files);
}
?>