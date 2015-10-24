<?php
require_once 'db.php';
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

session_start();
if(isset($_SESSION['username'])&&isset($_SESSION['uid'])){
    
    $username = $_SESSION['username'];
    $uid = $_SESSION['uid'];
}
else
    echo '<script>window.open("login.php?msg=invalid user","_self")</script>';
$title=$link=$desc="";
if(isset($_POST['title']))
    $title = $_POST['title'];
if(isset($_POST['link']))
    $link = $_POST['link'];
if(isset($_POST['desc']))
    $desc = $_POST['desc'];
$query = "insert into article(uid,title,link,`desc`) values($uid,'$title','$link','$desc')";
echo $query;
mysql_query($query) or die(mysql_error());
header("Location:index.php");