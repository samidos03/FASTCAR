<?php
// clients.php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $sql = "SELECT id, national_id as nationalId, last_name as lastName, 
                first_name as firstName, address, phone, email FROM clients"; // 🚨 Table 'clients'
        
        try {
            if ($id) {
                $stmt = $pdo->prepare($sql . " WHERE id = ?"); // ID est l'auto-incrément, pas le national_id
                $stmt->execute([$id]);
                echo json_encode($stmt->fetch() ?: (object)[]);
            } else {
                $stmt = $pdo->query($sql);
                echo json_encode($stmt->fetchAll());
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Erreur GET clients: " . $e->getMessage()]);
        }
        break;

    case 'POST': 
    $sql = "INSERT INTO clients (national_id, last_name, first_name, address, phone, email) 
            VALUES (:natid, :nom, :prenom, :adr, :tel, :email)";

    // 🚨 1. VÉRIFICATION DES DONNÉES REQUISES
    if (
        !isset($input['nationalId']) || empty($input['nationalId']) || 
        !isset($input['lastName']) || empty($input['lastName']) || 
        !isset($input['firstName']) || empty($input['firstName'])
    ) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Données requises manquantes (nationalId, lastName, firstName)."]);
        exit; // Arrête le script si les données sont invalides
    }
    
    // 🚨 2. EXÉCUTION DE L'INSERTION
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':natid' => $input['nationalId'],
            ':nom' => $input['lastName'],
            ':prenom' => $input['firstName'],
            ':adr' => $input['address'] ?? null, // Assurez-vous que les champs NULLABLE sont gérés
            ':tel' => $input['phone'] ?? null,
            ':email' => $input['email'] ?? null
        ]);
        
        http_response_code(201); // Created
        echo json_encode(["id" => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        
        // Gestion des erreurs spécifiques (par exemple, doublon de national_id)
        if (strpos($e->getMessage(), 'Duplicate entry') !== false && strpos($e->getMessage(), 'national_id')) {
             echo json_encode(["error" => "Erreur: Le numéro d'identité national existe déjà."]);
        } else {
             echo json_encode(["error" => "Erreur POST clients: " . $e->getMessage()]);
        }
    }
    break;
        
    case 'DELETE': 
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM clients WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["success" => $stmt->rowCount() > 0]);
        }
        break;
}
?>