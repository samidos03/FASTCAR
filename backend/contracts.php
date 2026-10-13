<?php
// contracts.php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null; // ID interne (INT)
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $sql = "SELECT 
                    id, 
                    contract_ref as contractRef, 
                    start_date as startDate, 
                    end_date as expectedEndDate,      
                    total_amount as totalAmount, 
                    payment_method as paymentMethod,   
                    client_id as clientId, 
                    car_id as carId, 
                    agent_id as agentId
                FROM contracts"; 
        
        try {
            if ($id) {
                $stmt = $pdo->prepare($sql . " WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode($stmt->fetch() ?: (object)[]);
            } else {
                $stmt = $pdo->query($sql);
                echo json_encode($stmt->fetchAll());
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Erreur GET contracts: " . $e->getMessage()]);
        }
        break;

    case 'POST':
        // 🚨 Utilisation des NOMS DE COLONNES EXACTS de la BDD (end_date, payment_method)
        $sql = "INSERT INTO contracts (
                    contract_ref, start_date, end_date, total_amount, 
                    payment_method, client_id, car_id, agent_id
                ) 
                VALUES (
                    :ref, :debut, :fin, :montant, :mode, :client, :car, :agent
                )";
        
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':ref' => $input['contractRef'],
                ':debut' => $input['startDate'],
                ':fin' => $input['expectedEndDate'], // 🚨 Utilise la colonne BDD 'end_date'
                ':montant' => $input['totalAmount'],
                ':mode' => $input['paymentMethod'],  // 🚨 Utilise la colonne BDD 'payment_method'
                ':client' => $input['clientId'], 
                ':car' => $input['carId'], 
                ':agent' => $input['agentId']
            ]);
            http_response_code(201);
            echo json_encode(["id" => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Erreur POST contracts: " . $e->getMessage()]);
        }
        break;
        
    case 'DELETE':
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM contracts WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["success" => $stmt->rowCount() > 0]);
        }
        break;
}
?>