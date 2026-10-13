<?php
// db.php
// 🚨 DÉBOGAGE: Afficher les erreurs PHP sur le serveur (à retirer en production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuration de la Base de Données
$host = 'localhost';
$db   = 'LOCATION_DB'; 
$user = 'root';
$pass = 'samid03'; // ⚠️ Vérifiez que c'est le bon mot de passe, souvent VIDE sur XAMPP.
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    // 🚨 Affichage détaillé de l'erreur de connexion BDD
    echo json_encode(["error" => "Erreur de connexion BDD: " . $e->getMessage(), "code" => $e->getCode()]);
    exit;
}

// Headers CORS (Doivent être ici pour couvrir tous les scripts qui incluent db.php)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>