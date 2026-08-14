<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Grab and clean up form data
    $name    = strip_tags(trim($_POST["name"]));
    $company = strip_tags(trim($_POST["company"]));
    $phone   = strip_tags(trim($_POST["phone"]));
    $email   = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $service = strip_tags(trim($_POST["service"]));
    $message = strip_tags(trim($_POST["message"]));

    // Basic validation
    if (empty($name) || empty($phone) || empty($email) || empty($message)) {
        http_response_code(400);
        echo "Please fill out all required fields and go back to try again.";
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please enter a valid email address and go back to try again.";
        exit;
    }

    $recipient = "test@huskyps.com";
    $subject   = "New Contact Form Submission - Husky Petroleum";

    $email_body  = "Name: $name\n";
    $email_body .= "Company: $company\n";
    $email_body .= "Phone: $phone\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Service Needed: $service\n";
    $email_body .= "Message:\n$message\n";

    // "From" uses your own domain so hosting mail servers don't flag it as spam;
    // "Reply-To" is the visitor's email so you can just hit reply.
    $headers  = "From: website@huskyps.com\r\n";
    $headers .= "Reply-To: $email\r\n";

    $sent = mail($recipient, $subject, $email_body, $headers);
    error_log("Mail send result: " . var_export($sent, true));
    if ($sent) {
        header("Location: thank-you.html");
        exit;
    } else {
        error_log("mail() failed. Last PHP error: " . print_r(error_get_last(), true));
        http_response_code(500);
        echo "Something went wrong sending your message. Please call us instead.";
    }

} else {
    http_response_code(403);
    echo "There was a problem with your submission.";
}
?>