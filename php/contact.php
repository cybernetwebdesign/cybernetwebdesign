<?php

// CUSTOMIZATION START

$to = "youremailaddress@domain.com";  // insert your subscribe email address here
$subject = "Contact Form Message";  // this will be the subject line 

// CUSTOMIZATION END

if (count($_POST["data"]) == 0) die("");

$from = $to;
$email_text = "";

foreach($_POST["data"] as $key => $value){
	if ($value != "") {
		if ($key == "email") {
			$from = $value;
		}
		$email_text.="<br><b>".ucfirst(str_replace("_", " ",$key))."</b> - ".nl2br(stripcslashes($value));
	}
}

$header = "From: $from\n" . "MIME-Version: 1.0\n" . "Content-type: text/html; charset=utf-8\n";

if (!mail($to, $subject, $email_text, $header,"-f$from")) {
  if (!mail($to, $subject, $email_text, $header)) {
	mail($to, $subject, $email_text);
  }
}

header( "Content-Type: application/json" );
echo '{"success":true}';

?>
