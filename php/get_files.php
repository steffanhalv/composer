<?php
$folder = $_GET['folder'];
$dir = "../files/".$folder."/";
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
                $new_file[] = $folder;

                $files[] = $new_file; // Add the file to the array
            }
        }
    }

    echo json_encode($files);
}
?>