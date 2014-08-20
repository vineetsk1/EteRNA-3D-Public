<?php
$type = "post_3d";
$params = $_POST;
if($type == "post_3d") {
    $name = $params['name'];
    $sequence = $params['seq'];
    $secondary_structure = $params['ss'];
    $list = $params["list"];
    $puzname = $params["puzname"];
    $data = $puzname . "\n" . $name . "\n" . $sequence . "\n" . $secondary_structure . "\n" . $list;
    file_put_contents("solutions/" . $puzname . "_" . $name . "_" . time() . ".txt", $data);
}
?>