<?php


 
    require_once __DIR__ . '/db_config.php';
    $mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE);
     $mysqli->set_charset("utf8");
    if ($mysqli->connect_error)
        die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
   
    return $mysqli;

