<?php
// cars.php
require_once 'db.php'; 

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $sql = "SELECT 
                    v.registration as id, 
                    v.registration, 
                    v.brand, 
                    v.model, 
                    v.daily_price as dailyPrice, 
                    v.mileage,
                    v.status,
                    v.image_url as imageUrl,
                    v.agent_id as responsibleAgentId
                FROM cars v"; // 🚨 Table 'cars' et alias 'v'
        
        try {
            if ($id) {
                $stmt = $pdo->prepare($sql . " WHERE v.registration = ?");
                $stmt->execute([$id]);
                echo json_encode($stmt->fetch() ?: (object)[]);
            } else {
                $stmt = $pdo->query($sql);
                echo json_encode($stmt->fetchAll());
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Erreur GET cars: " . $e->getMessage()]);
        }
        break;

    case 'POST':
        $sql = "INSERT INTO cars (registration, brand, model, daily_price, mileage, status, image_url, agent_id) 
                VALUES (:reg, :mar, :mod, :prix, :km, :etat, :url, :agent)";
        
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':reg' => $input['registration'],
                ':mar' => $input['brand'],
                ':mod' => $input['model'],
                ':prix' => $input['dailyPrice'],
                ':km' => $input['mileage'],
                ':etat' => $input['status'] ?? 'Available',
                ':url' => $input['imageUrl'] ?? null,
                ':agent' => $input['responsibleAgentId'] ?? null
            ]);
            http_response_code(201);
            echo json_encode(["id" => $input['registration']]);
        } catch (PDOException $e) {
             http_response_code(500);
             echo json_encode(["error" => "Erreur POST cars: " . $e->getMessage()]);
        }
        break;
        
    case 'DELETE':
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM cars WHERE registration = ?"); // 🚨 Table 'cars'
            $stmt->execute([$id]);
            echo json_encode(["success" => $stmt->rowCount() > 0]);
        }
        break;
}
?>