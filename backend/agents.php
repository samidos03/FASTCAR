<?php
// agents.php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
// ...

switch ($method) {
    case 'GET':
        // 🚨 Utilisation des guillemets obliques et de l'espace pour les colonnes
        // $sql = "SELECT `id`, 
        //                ` matricule` as matricule, 
        //                ` last_name` as lastName, 
        //                ` first_name` as firstName, 
        //                ` photo` as photo, 
        //                is_active as isActive
        //         FROM agents";
        //         // agents.php (dans le case 'GET')

$sql = "SELECT `id`, ` matricule` as matricule, ` last_name` as lastName, ` first_name` as firstName, ` photo`, is_active 
        FROM agents";
        
        try {
            // ... (Exécution du GET)
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Erreur GET agents: " . $e->getMessage()]);
        }
        break;

    case 'POST':
        $newMatricule = 'AG-' . time();
        
        // 🚨 Utilisation des guillemets obliques et de l'espace pour les colonnes
        $sql = "INSERT INTO agents (` matricule`, ` last_name`, ` first_name`, ` photo`, is_active) 
                VALUES (:mat, :nom, :prenom, :photo, :active)";
        
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':mat' => $newMatricule,
                ':nom' => $input['lastName'],
                ':prenom' => $input['firstName'],
                ':photo' => $input['photo'] ?? null,
                ':active' => $input['isActive'] ?? true
            ]);
            http_response_code(201);
            echo json_encode(["id" => $pdo->lastInsertId(), "matricule" => $newMatricule]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Erreur POST agents: " . $e->getMessage()]);
        }
        break;
        
    case 'DELETE':
        if ($id) {
            // WHERE ` id` INT (la colonne 'id' n'a pas d'espace, mais le WHERE pourrait être l'id interne)
            $stmt = $pdo->prepare("DELETE FROM agents WHERE id = ?"); 
            $stmt->execute([$id]);
            echo json_encode(["success" => $stmt->rowCount() > 0]);
        }
        break;
}
?>