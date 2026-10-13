import axios, { AxiosInstance, AxiosError } from 'axios';
import { Car, Client, Agent, Contract, AgencySettings } from '../types';

// 1. Définition de la BASE_URL (Reste inchangée)
const BASE_URL = 'http://localhost/FASTCAR/backend';

// 2. Création de l'instance Axios configurée
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Pour gérer les cookies/sessions (utile pour CORS)
});

// 3. Nouvelle fonction générique 'request' utilisant Axios
async function request<T>(endpoint: string, method: string = 'GET', data?: any): Promise<T> {
    try {
        const response = await apiClient.request<T>({
            url: endpoint,
            method: method,
            data: data, // Axios sérialise 'data' en JSON automatiquement pour POST/PUT
        });
        
        // Axios retourne les données utiles dans response.data
        return response.data;
        
    } catch (error) {
        // Gérer les erreurs HTTP (4xx et 5xx) que Axios intercepte
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            
            if (axiosError.response) {
                const errorData = axiosError.response.data as any;
                // Si le backend PHP a renvoyé un objet { "error": "..." }
                const errorMessage = errorData.error || `Erreur HTTP ${axiosError.response.status}`;

                console.error(`Erreur lors de l'appel à ${endpoint} (Axios):`, errorMessage);
                throw new Error(errorMessage);
            }
        }
        console.error(`Erreur réseau/inconnue lors de l'appel à ${endpoint}:`, error);
        throw new Error('Erreur réseau ou inconnue.');
    }
}

// 4. Export des fonctions API (Utilisent la nouvelle fonction 'request')
export const api = {
    // --- VOITURES (cars.php) ---
    getCars: () => request<Car[]>('cars.php'),
    addCar: (car: Omit<Car, 'id'>) => request<Car>('cars.php', 'POST', car),
    updateCar: (id: string, car: Partial<Car>) => request<Car>(`cars.php?id=${id}`, 'PUT', car),
    deleteCar: (id: string) => request(`cars.php?id=${id}`, 'DELETE'),

    // --- CLIENTS (clients.php) ---
    getClients: () => request<Client[]>('clients.php'),
    addClient: (client: Omit<Client, 'id'>) => request<Client>('clients.php', 'POST', client),
    updateClient: (id: string, client: Partial<Client>) => request<Client>(`clients.php?id=${id}`, 'PUT', client),
    deleteClient: (id: string) => request(`clients.php?id=${id}`, 'DELETE'),

    // --- AGENTS (agents.php) ---
    getAgents: () => request<Agent[]>('agents.php'),
    addAgent: (agent: Omit<Agent, 'id'>) => request<Agent>('agents.php', 'POST', agent),
    updateAgent: (id: string, agent: Partial<Agent>) => request<Agent>(`agents.php?id=${id}`, 'PUT', agent),
    deleteAgent: (id: string) => request(`agents.php?id=${id}`, 'DELETE'),

    // --- CONTRATS (contracts.php) ---
    getContracts: () => request<Contract[]>('contracts.php'),
    addContract: (contract: Omit<Contract, 'id'>) => request<Contract>('contracts.php', 'POST', contract),
    deleteContract: (id: string) => request(`contracts.php?id=${id}`, 'DELETE'),

    // --- PARAMÈTRES (settings.php) ---
    getSettings: () => request<AgencySettings>('settings.php'),
    updateSettings: (settings: Partial<AgencySettings>) => request<AgencySettings>('settings.php', 'PUT', settings),
};