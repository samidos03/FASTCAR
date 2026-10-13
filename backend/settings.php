<?php
// settings.php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $sql = "SELECT id, name, address, phone, email, logo_url as logoUrl, currency FROM agency_settings WHERE id = 1"; // 🚨 Table 'agency_settings'
        
        try {
            $stmt = $pdo->query($sql);
            echo json_encode($stmt->fetch() ?: (object)[]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Erreur GET settings: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        $sql = "UPDATE agency_settings SET name = :name, address = :adr, phone = :tel, email = :email, logo_url = :url, currency = :devise WHERE id = 1";
        
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':name' => $input['name'],
                ':adr' => $input['address'],
                ':tel' => $input['phone'],
                ':email' => $input['email'],
                ':url' => $input['logoUrl'] ?? null,
                ':devise' => $input['currency']
            ]);
            echo json_encode(["message" => "Paramètres mis à jour"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Erreur PUT settings: " . $e->getMessage()]);
        }
        break;
}
?>