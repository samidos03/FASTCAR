
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CarList from './components/CarList';
import ClientList from './components/ClientList';
import AgentList from './components/AgentList';
import ContractForm from './components/ContractForm';
import ContractList from './components/ContractList';
import Invoice from './components/Invoice';
import Settings from './components/Settings';
import { api } from './services/api';
import { Car, Agent, Contract, Client, AgencySettings } from './types';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [cars, setCars] = useState<Car[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [settings, setSettings] = useState<AgencySettings>({ name: '', address: '', phone: '', email: '', logoUrl: '', currency: '' });

  // UI State
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [c, a, cl, co, s] = await Promise.all([
                api.getCars(),
                api.getAgents(),
                api.getClients(),
                api.getContracts(),
                api.getSettings()
            ]);
            setCars(c);
            setAgents(a);
            setClients(cl);
            setContracts(co);
            setSettings(s);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // Handlers
  const refreshData = async () => {
      setCars(await api.getCars());
      setAgents(await api.getAgents());
      setClients(await api.getClients());
      setContracts(await api.getContracts());
  };

  const handleContractSubmit = async (contractData: Omit<Contract, 'id'>) => {
    await api.addContract(contractData);
    await refreshData();
    setCurrentView('contracts');
  };

  const handleDeleteContract = async (id: string) => {
      if(confirm('Are you sure you want to delete this contract?')) {
          await api.deleteContract(id);
          await refreshData();
      }
  };

  const handleCarActions = {
      add: async (c: any) => { await api.addCar(c); refreshData(); },
      update: async (id: string, c: any) => { await api.updateCar(id, c); refreshData(); },
      delete: async (id: string) => { if(confirm('Delete car?')) { await api.deleteCar(id); refreshData(); } }
  };

  const handleClientActions = {
      add: async (c: any) => { await api.addClient(c); refreshData(); },
      update: async (id: string, c: any) => { await api.updateClient(id, c); refreshData(); },
      delete: async (id: string) => { if(confirm('Delete client?')) { await api.deleteClient(id); refreshData(); } }
  };

  const handleAgentActions = {
      add: async (c: any) => { await api.addAgent(c); refreshData(); },
      update: async (id: string, c: any) => { await api.updateAgent(id, c); refreshData(); },
      delete: async (id: string) => { if(confirm('Delete agent?')) { await api.deleteAgent(id); refreshData(); } }
  };

  const renderContent = () => {
    if (loading) return <div className="flex h-full items-center justify-center text-majorelle">Loading system...</div>;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard cars={cars} agents={agents} clients={clients} contracts={contracts} />;
      case 'cars':
        return <CarList cars={cars} agents={agents} onAddCar={handleCarActions.add} onUpdateCar={handleCarActions.update} onDeleteCar={handleCarActions.delete} />;
      case 'clients':
        return <ClientList clients={clients} contracts={contracts} onAddClient={handleClientActions.add} onUpdateClient={handleClientActions.update} onDeleteClient={handleClientActions.delete} />;
      case 'agents':
        return <AgentList agents={agents} cars={cars} onAddAgent={handleAgentActions.add} onUpdateAgent={handleAgentActions.update} onDeleteAgent={handleAgentActions.delete} />;
      case 'new-contract':
        return (
          <ContractForm 
            cars={cars} agents={agents} clients={clients}
            onSubmit={handleContractSubmit}
            onCancel={() => setCurrentView('contracts')}
          />
        );
      case 'invoice':
        if (!selectedContract) return <div>No contract selected.</div>;
        // In full ID mode, Invoice needs resolving. For now, we mock the resolved object for the Invoice component
        // Or better, update Invoice to take IDs and resolve them. 
        // For simplicity, we create a temporary "resolved" contract object for the legacy Invoice component
        const resolvedContract = {
            ...selectedContract,
            client: clients.find(c => c.id === selectedContract.clientId)!,
            car: cars.find(c => c.id === selectedContract.carId)!,
            agent: agents.find(a => a.id === selectedContract.agentId)!
        };
        return <Invoice contract={resolvedContract as any} onBack={() => setCurrentView('contracts')} />;
      case 'contracts':
        return (
            <ContractList 
                contracts={contracts} clients={clients} cars={cars}
                onEditContract={() => {}} // TODO: Implement edit
                onViewInvoice={(c) => { setSelectedContract(c); setCurrentView('invoice'); }}
                onDeleteContract={handleDeleteContract}
            />
        );
      case 'settings':
          return <Settings settings={settings} onUpdate={async (s) => { await api.updateSettings(s); setSettings(s); }} />;
      default:
        return <Dashboard cars={cars} agents={agents} clients={clients} contracts={contracts} />;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen print:ml-0 print:p-0">
        <div className="max-w-7xl mx-auto">
             <div className="mb-8 flex justify-between items-center no-print">
                <h1 className="text-2xl font-bold text-slate-800 capitalize">
                    {currentView.replace('-', ' ')}
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500 font-medium">{settings.name}</span>
                    <div className="h-8 w-8 bg-majorelle rounded-full text-white flex items-center justify-center font-bold text-xs">
                        {settings.name.charAt(0)}
                    </div>
                </div>
             </div>
             {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
