
import React, { useState } from 'react';
import { Agent, Car } from '../types';
import { PlusCircle, Edit, Trash2, UserCheck, Car as CarIcon } from 'lucide-react';

interface AgentListProps {
  agents: Agent[];
  cars: Car[];
  onAddAgent: (agent: Omit<Agent, 'id'>) => void;
  onUpdateAgent: (id: string, agent: Partial<Agent>) => void;
  onDeleteAgent: (id: string) => void;
}

const AgentList: React.FC<AgentListProps> = ({ agents, cars, onAddAgent, onUpdateAgent, onDeleteAgent }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Agent, 'id'>>({ lastName: '', firstName: '' });

    const getAssignedCars = (agentId: string) => cars.filter(c => c.agentId === agentId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            onUpdateAgent(editingId, formData);
        } else {
            onAddAgent(formData);
        }
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ lastName: '', firstName: '' });
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Agents</h2>
                    <p className="text-slate-500 text-sm">Manage staff and vehicle assignments</p>
                </div>
                <button onClick={() => { setEditingId(null); setIsFormOpen(!isFormOpen); }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <PlusCircle className="w-4 h-4" /> {isFormOpen ? 'Close Form' : 'Add Agent'}
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-white p-6 rounded-xl shadow border border-purple-100 mb-6 max-w-lg">
                    <h3 className="font-bold text-purple-800 mb-4">{editingId ? 'Edit Agent' : 'New Agent'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input className="p-2 border rounded" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                            <input className="p-2 border rounded" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map(agent => {
                    const assignedCars = getAssignedCars(agent.id);
                    return (
                        <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col">
                             <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
                                        {agent.firstName[0]}{agent.lastName[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{agent.lastName} {agent.firstName}</h3>
                                        <p className="text-xs text-slate-500">Agent ID: {agent.id}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setFormData(agent); setEditingId(agent.id); setIsFormOpen(true); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => onDeleteAgent(agent.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            
                            <div className="mt-4 flex-1">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <CarIcon className="w-3 h-3" /> Assigned Vehicles ({assignedCars.length})
                                </p>
                                {assignedCars.length > 0 ? (
                                    <ul className="space-y-1">
                                        {assignedCars.map(car => (
                                            <li key={car.id} className="text-sm bg-slate-50 px-2 py-1 rounded text-slate-700 border border-slate-100 flex justify-between">
                                                <span>{car.brand} {car.model}</span>
                                                <span className="text-xs text-slate-400">{car.registration}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-300 italic">No vehicles assigned.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AgentList;
