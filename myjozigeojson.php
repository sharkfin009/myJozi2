<?php
 
/*
 * Following code will return a JSON file containing the Location, Activity and Time from myJozi participants 

 */
 
// array for JSON response

$response = array();
$totalresponse = array();
$androidids = $_POST['androidids'];
$fromDate = $_POST['fromDate'];
$toDate = $_POST['toDate'];
$mode = $_POST['mode'];
$race = $_POST['race'];
$income = $_POST['income'];
$employment = $_POST['employment'];
$city = $_POST['city'];





// include db connect class
    require_once __DIR__ ."/db_connect.php";
    // connecting to db
    //$db = db_connect();

//ben's test query
//$query = "SELECT ANDROIDID,TIMESTMP,LONGITUDE,LATITUDE,ACTIVITYNAME FROM ACTIVITYLOCATION";

// Markus's query code

    // mysql inserting a new row

    $prefix = $IDList = '';
    foreach ($androidids as $ID){
      $IDList .= $prefix . $ID ;
      $prefix = ', ';
    }
   

  $query = "SELECT ANDROIDID, TIMESTMP, ACTIVITYNAME, LONGITUDE, LATITUDE FROM ACTIVITYLOCATION 
   WHERE STR_TO_DATE(TIMESTMP , '%d\/%m\/%Y %H:%i') BETWEEN STR_TO_DATE('$fromDate' , '%Y%m%d') AND STR_TO_DATE('$toDate' , '%Y%m%d') AND ANDROIDID IN ($IDList) ";
//$query ="SELECT TIMESTMP FROM ACTIVITYLOCATION";

//  if ($mode != 'All') {
//    $query .= "AND ACTIVITYNAME='$mode' ";
//  }
file_put_contents(__DIR__ . "/dump.php", $query);


$query .= " ORDER by TIMESTMP ASC";


$result = $mysqli->query($query);

if ($result->num_rows > 0) {

  while ($row = mysqli_fetch_array($result)) {
    $row_array['name'] = $row['ANDROIDID'];
    $row_array['activity'] = $row['ACTIVITYNAME'];
    $row_array['lng'] = $row['LONGITUDE'];
    $row_array['lat'] = $row['LATITUDE'];

    $row_array['timestamp'] = $row['TIMESTMP'];

    array_push($response, $row_array);
  }

  array_push($totalresponse, $response);

} else {
  echo "0 results";}


$file = 'results.json';
$current = json_encode($totalresponse);
file_put_contents($file, $current);
echo json_encode($totalresponse);

// $fp = fopen('results.json', 'w');
// fwrite($fp, json_encode($totalresponse));
// fclose($fp);
//   }
//   else {
//     file_put_contents('results.json',"oops");
//   }

// //return JSOn encoded String
// echo json_encode($totalresponse);



