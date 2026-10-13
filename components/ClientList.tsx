
import React, { useState } from 'react';
import { Client, Contract } from '../types';
import { Search, PlusCircle, Edit, Trash2, User, Phone, MapPin, Mail, History, DollarSign, Clock } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  contracts: Contract[];
  onAddClient: (client: Omit<Client, 'id'>) => void;
  onUpdateClient: (id: string, client: Partial<Client>) => void;
  onDeleteClient: (id: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, contracts, onAddClient, onUpdateClient, onDeleteClient }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Client, 'id'>>({
        nationalId: '', lastName: '', firstName: '', address: '', phone: '', email: ''
    });

    // Helper: Calculate Client Stats
    const getClientStats = (clientId: string) => {
        const clientContracts = contracts.filter(c => c.clientId === clientId);
        const totalSpent = clientContracts.reduce((sum, c) => sum + c.totalAmount, 0);
        const totalDuration = clientContracts.reduce((sum, c) => {
             const days = Math.ceil((new Date(c.endDate).getTime() - new Date(c.startDate).getTime()) / (1000 * 60 * 60 * 24));
             return sum + days;
        }, 0);
        return { totalSpent, totalDuration, contractCount: clientContracts.length };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            onUpdateClient(editingId, formData);
        } else {
            onAddClient(formData);
        }
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ nationalId: '', lastName: '', firstName: '', address: '', phone: '', email: '' });
    };

    const handleEdit = (client: Client) => {
        setFormData({
            nationalId: client.nationalId, lastName: client.lastName, firstName: client.firstName,
            address: client.address, phone: client.phone, email: client.email
        });
        setEditingId(client.id);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Clients</h2>
                    <p className="text-slate-500 text-sm">Manage customer database and history</p>
                </div>
                <button onClick={() => { setEditingId(null); setIsFormOpen(!isFormOpen); }} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <PlusCircle className="w-4 h-4" /> {isFormOpen ? 'Close Form' : 'Add Client'}
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-white p-6 rounded-xl shadow border border-emerald-100 mb-6">
                    <h3 className="font-bold text-emerald-800 mb-4">{editingId ? 'Edit Client' : 'New Client'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="p-2 border rounded" placeholder="National ID" value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} required />
                        <input className="p-2 border rounded" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                        <input className="p-2 border rounded" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                        <input className="p-2 border rounded" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                        <input className="p-2 border rounded" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        <input className="p-2 border rounded" placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        <div className="md:col-span-2 flex justify-end gap-2">
                            <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {clients.map(client => {
                    const stats = getClientStats(client.id);
                    return (
                        <div key={client.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{client.lastName} {client.firstName}</h3>
                                        <p className="text-xs text-slate-500 font-mono">{client.nationalId}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEdit(client)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => onDeleteClient(client.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            
                            <div className="space-y-2 text-sm text-slate-600 mb-4">
                                <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {client.phone}</div>
                                <div className="flex items-center gap-2 truncate"><MapPin className="w-3 h-3" /> {client.address}</div>
                                <div className="flex items-center gap-2 truncate"><Mail className="w-3 h-3" /> {client.email}</div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1 flex justify-center items-center gap-1"><History className="w-3 h-3" /> Contracts</p>
                                    <p className="font-bold text-slate-800">{stats.contractCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-1 flex justify-center items-center gap-1"><Clock className="w-3 h-3" /> Days</p>
                                    <p className="font-bold text-slate-800">{stats.totalDuration}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-1 flex justify-center items-center gap-1"><DollarSign className="w-3 h-3" /> Spent</p>
                                    <p className="font-bold text-majorelle">{stats.totalSpent} MAD</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ClientList;
