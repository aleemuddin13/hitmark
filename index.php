<?php require_once 'db.php';
 require_once 'include_html.html';?>



<?php

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
echo '<h1>welcome : '.$username.'</h1>';
?>
<a href="logout.php">logout</a>
<button class="btn btn-primary" id="addArticleButton" style="width:100%">Add Article</button>

<div class="container row" id="addArticleDiv" style="margin:10px" hidden>
    <form method="post" action="addArticle.php" >
        
    <div class="col-xs-4">
        <label for="title">TITLE:</label>
               <input type="text" placeholder="Enter your Article Title"  id="title" name="title" class="form-control">
    </div>
    <div class="col-xs-8">
        <label for="link">Link(if any):</label>
        <input type="text" placeholder="Enter your Article Link" id="link" name="link" class="form-control">
    </div>
        <div class="col-xs-12">
        <label for="desc">DESCRIPTION:</label>
        <textarea class="form-control custom-control" id="desc" name="desc" rows="3"></textarea>
    </div>
        <div  class="col-xs-12" style="margin:3px"></div>
    <div class="col-xs-12"> 
        <input type="submit" class="btn btn-success col-xs-6" id="saveArticleButton" value="Save Article">
        <input type="button" class="btn btn-danger col-xs-6" id="cancelArticleButton" value="Cancel">
    </div>
    </form>
</div>

<?php 
$query = "select * from article where uid = $uid order by aid desc";
$result = mysql_query($query) or die(mysql_error());
if(mysql_num_rows($result)==0)
{
    echo '<h3>You Dont have any saved Articles.</h3>';
}
else{
    echo '<h1><u>Previously Saved Articles:</u></h1>';
    $i =1;
    while($row=  mysql_fetch_assoc($result))
    {
        echo "<div class='row' style='margin:10px'>";
        echo "<div class='col-xs-12'><h2>$i){$row['title']}:-</h2></div><div class='container row' style='margin-left:30px'>";
        if(isset($row['link']))
        echo "<div class='col-xs-12'><a href={$row['link']}>{$row['link']}</a></div>";
        if(isset($row['desc']))
        echo "<div class='col-xs-12'><h1>{$row['desc']}</h1></div></div>";
        $i++;
    }
    echo '</div>';
}

?>

<script>

$( document ).ready(function() {
   $("#addArticleButton").click(function(){
        $('#addArticleDiv').show();
        $(this).hide();
    });
    $('#cancelArticleButton').click(function(){
        $('#addArticleDiv').hide();
        $("#addArticleButton").show();
    });

});

</script>