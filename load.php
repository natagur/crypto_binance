<?
header('Access-Control-Allow-Origin: *');
if (isset($_GET['url'])) {
    echo file_get_contents($_GET['url']);
} else {
    echo json_encode(["error" => "not url!"]);
}
?>