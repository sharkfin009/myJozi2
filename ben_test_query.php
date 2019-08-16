<?php
require_once __DIR__ .  "/db_connect.php";
file_put_contents(__DIR__."/dump.php", $_POST);
$query = "SELECT ANDROIDID FROM ACTIVITYLOCATION";
$result = $mysqli->query($query);
if ($result->num_rows > 0) {
    // output data of each row
    while ($row = $result->fetch_assoc()) {
       file_put_contents( __DIR__ ."/dbDump.txt",  $row["ANDROIDID"]);
    }
} else {
    echo "0 results";
}

?>

 