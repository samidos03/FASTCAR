SET FOREIGN_KEY_CHECKS = 0; 
-- Commencer par DROP TABLE des tables de référence
DROP TABLE IF EXISTS payment_method_ref;
DROP TABLE IF EXISTS vehicle_status_ref;
DROP TABLE IF EXISTS incidents;
DROP TABLE IF EXISTS contracts;
DROP TABLE IF EXISTS cars;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS agents;
DROP TABLE IF EXISTS agency_settings;


--- 1. Tables de Référence (Récupération des codes)

-- 1A. Table des États de Véhicule (Reference)

-- 1A. Table des États de Véhicule (Reference)
CREATE TABLE vehicle_status_ref (
    code VARCHAR(20) PRIMARY KEY, -- Code d'état (Ex: DISPO, LOUE)
    description VARCHAR(100) NOT NULL
);
INSERT INTO vehicle_status_ref (code, description) VALUES
('DISPO', 'Available'), ('LOUE', 'Rented'), ('MAINT', 'Maintenance');



-- 1B. Table des Modes de Paiement (Reference)


CREATE TABLE payment_method_ref (
code VARCHAR(20) PRIMARY KEY, -- Code de paiement (Ex: ESPECE, CARTE)
description VARCHAR(100) NOT NULL
);

INSERT INTO payment_method_ref (code, description) VALUES
('ESPECE', 'Cash payment'),
('CARTE', 'Card payment'),
('VIREMENT', 'Bank transfer'),
('CHÈQUE', 'Check payment');

--- 2. Tables Principales (avec Clés Primaires INT)

-- 2A. Table Settings (agency_settings) - Pour settings.php
CREATE TABLE agency_settings (
    id INT PRIMARY KEY DEFAULT 1,
    name VARCHAR(100) NOT NULL, 
    address VARCHAR(255) NOT NULL, 
    phone VARCHAR(20) NOT NULL, 
    email VARCHAR(100) NOT NULL UNIQUE, 
    logo_url VARCHAR(255), 
    currency VARCHAR(10) DEFAULT 'MAD' NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO agency_settings (id, name, address, phone, email, currency) VALUES (1, 'FastCar El Bahja', 'Bd Mohammed V, Guéliz, Marrakech', '05 24 33 44 55', 'contact@fastcar.com', 'MAD')
ON DUPLICATE KEY UPDATE name=VALUES(name);


-- 2B. Table Agents (agents) - Pour agents.php
CREATE TABLE agents ( 
id INT AUTO_INCREMENT PRIMARY KEY,  
 matricule VARCHAR(20) UNIQUE NOT NULL, -- Mat. Agent (Reste l'identifiant métier)
 last_name VARCHAR(50) NOT NULL, 
 first_name VARCHAR(50) NOT NULL, 
 photo VARCHAR(255),
is_active BOOLEAN DEFAULT TRUE
);


-- 2C. Table Clients (clients) - Pour clients.php
-- 2C. Table Clients (clients) - Pour clients.php
CREATE TABLE clients (
id INT AUTO_INCREMENT PRIMARY KEY, -- Nettoyé ici
national_id VARCHAR(20) UNIQUE NOT NULL, -- CIN/National ID (Reste l'identifiant métier)
last_name VARCHAR(50) NOT NULL, 
first_name VARCHAR(50) NOT NULL, 
address VARCHAR(255), 
phone VARCHAR(20), 
email VARCHAR(100) UNIQUE
);


-- 2D. Table Voitures (cars) - Pour cars.php
CREATE TABLE cars (
id INT AUTO_INCREMENT PRIMARY KEY, 
registration VARCHAR(20) UNIQUE NOT NULL, -- Matricule (Reste l'identifiant métier)
brand VARCHAR(50) NOT NULL, 
model VARCHAR(50) NOT NULL, 
daily_price DECIMAL(10, 2) NOT NULL CHECK (daily_price > 0), 
image_url VARCHAR(255), -- Corresponds à la colonne 'image_url' dans le PHP
status VARCHAR(20) DEFAULT 'DISPO' NOT NULL, -- Corresponds à la colonne 'status' dans le PHP
mileage INT NOT NULL DEFAULT 0,
agent_id INT,
FOREIGN KEY (agent_id) REFERENCES agents(id),
FOREIGN KEY (status) REFERENCES vehicle_status_ref(code)
);


-- 2E. Table Contrats (contracts) - Pour contracts.php
CREATE TABLE contracts (
 id INT AUTO_INCREMENT PRIMARY KEY, 
contract_ref VARCHAR(50) UNIQUE NOT NULL, -- Référence du contrat (Reste l'identifiant métier)
start_date DATE NOT NULL, 
end_date DATE NOT NULL, 
total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
payment_method VARCHAR(20) NOT NULL, -- Corresponds à la colonne 'payment_method' dans le PHP
client_id INT NOT NULL, -- Clé étrangère vers clients(id)
car_id INT NOT NULL, -- Clé étrangère vers cars(id)
agent_id INT NOT NULL,
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
FOREIGN KEY (car_id) REFERENCES cars(id),
FOREIGN KEY (agent_id) REFERENCES agents(id),
FOREIGN KEY (payment_method) REFERENCES payment_method_ref(code),
CHECK (start_date <= end_date) 
);


SET FOREIGN_KEY_CHECKS = 1;