<?php 
require_once 'db.php';

$username = $_POST['uname'];
$password = $_POST['pass'];


$query = "select uid from login where username='$username' and password = '$password'";
$result = mysql_query($query) or die(mysql_error());

if(mysql_num_rows($result)==1){
    echo 'succesful login';
    session_start();
    $_SESSION['username'] = $username;
    $row = mysql_fetch_assoc($result);
    $_SESSION['uid'] = $row['uid'];
    echo '<script>window.open("index.php","_self")</script>';
}
 else {
    echo '<script>window.open("login.php?msg=invalid user","_self")</script>';
}
?>