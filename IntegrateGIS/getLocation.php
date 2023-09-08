<?php

include_once("connection.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $latitude = test_input($_POST["latitude"]);
    $longitude = test_input($_POST["longitude"]);

    $query = "SELECT dist_name, state_name FROM public.india_districts WHERE ST_Within(ST_SetSRID(ST_MakePoint($longitude, $latitude), 0), geom)";
    $stmt = pg_prepare($dbconn, "fetch_district_info", $query);
    $result = pg_execute($dbconn, "fetch_district_info", array($longitude, $latitude));

    if ($result) {
        $Data = array();
        while ($row = pg_fetch_assoc($result)) {
            $Data[] = $row;
        }

        if (empty($Data)) {
            echo json_encode(["success" => false, "message" => "No matching district found."]);
        } else {
            echo json_encode(["success" => true, "data" => $Data]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Error fetching district data"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
pg_close($dbconn);
?>

