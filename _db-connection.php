<?php
$mysqli = new mysqli( '127.0.0.1', 'root', '123456789', 'color_match' );
$id     = 3;
if ( $_POST['operation'] === 'save' ) {
	$mysqli->query( "INSERT INTO results (serial, id) VALUES ('" . $_POST['data'] . "', '" . $id . "')" );
	echo 'Neural Network Updated';
} else {
	if ( $result = $mysqli->query( 'SELECT serial FROM results WHERE id = ' . $id ) ) {
		if ( $result->num_rows > 0 ) {
			while ( $row = $result->fetch_array() ) {
				echo( $row['serial'] );
			}
			$result->free();
		}
	}
}
