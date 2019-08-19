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

file_put_contents(__DIR__ . "/dump.php",$androidids );



// include db connect class
    require_once __DIR__ ."/db_connect.php";
    // connecting to db
    //$db = db_connect();

$query = "SELECT ANDROIDID,TIMESTMP FROM ACTIVITYLOCATION";

$result = $mysqli->query($query);

if ($result->num_rows > 0) {

  while ($row = mysqli_fetch_array($result)) {
    $row_array['name'] = $row['ANDROIDID'];
    $row_array['activity'] = $row['ACTIVITYNAME'];
    $row_array['lat'] = $row['LATITUDE'];
    $row_array['lng'] = $row['LONGITUDE'];
    $row_array['timestamp'] = $row['TIMESTMP'];

    array_push($response, $row_array);
  }

  array_push($totalresponse, $response);

} else {
  echo "0 results";}


$file = 'results.json';
$current = json_encode($totalresponse);
file_put_contents($file, $current);

// $fp = fopen('results.json', 'w');
// fwrite($fp, json_encode($totalresponse));
// fclose($fp);
//   }
//   else {
//     file_put_contents('results.json',"oops");
//   }

// //return JSOn encoded String
// echo json_encode($totalresponse);




// Markus's query code

    // mysql inserting a new row

    // $prefix = $IDList = '';
    // foreach ($androidids as $ID){
    //   $IDList .= $prefix . '"' . $ID . '"';
    //   $prefix = ', ';
    // }


// if ($race != 'All' ||  $income != 'All' ||  $employment != 'All'  ||   $city != 'All') {

//   $query = "SELECT al.androidid, al.timestamp, al.activityname, al.longitude, al.latitude FROM ACTIVITYLOCATION al LEFT JOIN SURVEYQUESTIONS sq ON (al.androidid=sq.androidid)
//     WHERE  STR_TO_DATE(al.timestamp , '%d/%m/%Y %H:%i') between STR_TO_DATE('$fromDate' , '%d/%m/%Y %H:%i') AND STR_TO_DATE('$toDate' , '%d/%m/%Y %H:%i') AND al.androidid IN ($IDList) ";
// } else {
//   $query = "SELECT al.androidid, al.timestamp, al.activityname, al.longitude, al.latitude FROM ACTIVITYLOCATION al
//     WHERE  STR_TO_DATE(al.timestamp , '%d/%m/%Y %H:%i') between STR_TO_DATE('$fromDate' , '%d/%m/%Y %H:%i') AND STR_TO_DATE('$toDate' , '%d/%m/%Y %H:%i')  AND al.androidid IN ($IDList) ";
// }


// if ($mode != 'All') {
//   $query .= "AND al.activityname='$mode' ";
// }

// if ($race != 'All') {
//   $query .= "AND sq.SURVEYQUESTION17='$race' ";
// }

// if ($income != 'All') {
//   $query .= "AND sq.SURVEYQUESTION19='$income' ";
// }

// if ($employment != 'All') {
//   $query .= "AND sq.SURVEYQUESTION6='$employment' ";
// }

// if ($city != 'All') {
//   $query .= "AND sq.SURVEYQUESTION1='$city' ";
// }


// $query .= " ORDER by al.timestamp ASC";
