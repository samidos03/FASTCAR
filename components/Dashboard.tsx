
import React from 'react';
import { Car, Agent, Client, Contract, CarStatus } from '../types';
import { LayoutDashboard, Users, Car as CarIcon, FileText, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
    cars: Car[];
    agents: Agent[];
    clients: Client[];
    contracts: Contract[];
}

const StatCard: React.FC<{ title: string; value: number; icon: any; color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between`}>
        <div>
            <p className="text-slate-500 text-sm font-medium uppercase">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className={`p-4 rounded-full ${color} text-white`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ cars, agents, clients, contracts }) => {
    const availableCars = cars.filter(c => c.status === CarStatus.AVAILABLE);
    const rentedCars = cars.filter(c => c.status === CarStatus.RENTED);
    const maintenanceCars = cars.filter(c => c.status === CarStatus.MAINTENANCE);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Cars" value={cars.length} icon={CarIcon} color="bg-majorelle" />
                <StatCard title="Active Contracts" value={contracts.length} icon={FileText} color="bg-ocre" />
                <StatCard title="Clients" value={clients.length} icon={Users} color="bg-emerald-500" />
                <StatCard title="Agents" value={agents.length} icon={CheckCircle} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Car Status List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CarIcon className="w-5 h-5 text-majorelle" /> Fleet Status
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                            <span className="text-green-800 font-medium">Available</span>
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">{availableCars.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                            <span className="text-orange-800 font-medium">Rented</span>
                            <span className="bg-ocre text-white px-3 py-1 rounded-full text-sm font-bold">{rentedCars.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-slate-800 font-medium">Maintenance</span>
                            <span className="bg-slate-600 text-white px-3 py-1 rounded-full text-sm font-bold">{maintenanceCars.length}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Availability View */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-ocre" /> Recently Added Cars
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {cars.slice(0, 4).map(car => (
                            <div key={car.id} className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded transition-colors">
                                <img src={car.image} alt={car.model} className="w-12 h-12 rounded object-cover" />
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{car.brand} {car.model}</p>
                                    <p className="text-xs text-slate-500">{car.registration}</p>
                                </div>
                                <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                                    car.status === CarStatus.AVAILABLE ? 'bg-green-100 text-green-700' : 
                                    car.status === CarStatus.RENTED ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                                }`}>
                                    {car.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
