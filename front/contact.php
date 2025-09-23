<?php

// Vérifier que le formulaire est soumis en POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupèrer les données envoyées par le formulaire
    $nom = htmlspecialchars($_POST['nom'] ?? '');
    $email = htmlspecialchars($_POST['email'] ?? '');
    $sujet = htmlspecialchars($_POST['sujet'] ?? 'Contact depuis le site');
    $message = htmlspecialchars($_POST['message'] ?? '');

    // Prépare l'email
    $to = "opendevmg@gmail.com"; // Destinataire
    $subject = $sujet;           // Sujet du mail
    $body = "Nom: $nom\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email\r\nReply-To: $email";

    // Envoie l'email
    if (mail($to, $subject, $body, $headers)) {
        echo "Message envoyé avec succès !";
    } else {
        echo "Erreur lors de l'envoi du message.";
    }
} else {
    echo "Accès non autorisé.";
}
?>