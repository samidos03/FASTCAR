SET FOREIGN_KEY_CHECKS = 0; -- Désactiver temporairement les contraintes

--- 1. Agents (agents)
-- Ces agents sont nécessaires pour les clés étrangères (FK) des voitures et contrats.
INSERT INTO agents (id, matricule, last_name, first_name, is_active) 
VALUES 
(1, 'AG-001', 'DUPONT', 'Marine', TRUE),
(2, 'AG-002', 'BENALI', 'Omar', TRUE);

--- 2. Clients (clients)
-- Les clients sont nécessaires pour les contrats.
INSERT INTO clients (id, national_id, last_name, first_name, phone, email) 
VALUES
(1, 'EE12345', 'MARTIN', 'Jacques', '0610203040', 'j.martin@test.com'),
(2, 'FF98765', 'EL ALAMI', 'Nadia', '0690807060', 'n.alami@test.com');

--- 3. Voitures (cars)
-- Les voitures sont nécessaires pour les contrats et le dashboard.
INSERT INTO cars (id, registration, brand, model, daily_price, mileage, status, agent_id)
VALUES
(101, 'W-1234-A', 'RENAULT', 'Clio V', 250.00, 15000, 'DISPO', 1),
(102, 'F-5678-B', 'FORD', 'Focus', 350.00, 50000, 'LOUE', 2),
(103, 'A-9012-C', 'TESLA', 'Model 3', 800.00, 5000, 'DISPO', 1);

--- 4. Contrats (contracts)
-- Un contrat actif ('EN_COURS') et un contrat terminé.
INSERT INTO contracts (id, contract_ref, start_date, end_date, total_amount, payment_method, client_id, car_id, agent_id)
VALUES
(201, 'CTR-20251120-001', '2025-11-20', '2025-11-30', 2500.00, 'CARTE', 1, 102, 1), -- Voiture 102 (LOUE)
(202, 'CTR-20251125-002', '2025-11-25', '2025-12-05', 3000.00, 'ESPECE', 2, 103, 2); -- Voiture 103 (DISPO)

SET FOREIGN_KEY_CHECKS = 1; -- Réactiver les contraintes