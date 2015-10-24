



<?php
if(isset($_GET['msg']))
    echo '<h1>'.$_GET['msg'].'</h1><br>';
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

?>

<form style="text-align: center" action="abc.php" method="POST">
    Username : <input type="text" name="uname"><br>
    <br>   Password: <input type="password" name="pass"><br><br>
    <input type="submit" value="Log In">
</form>
