
import React, { useState, useEffect } from 'react';
import { Car, Client, Agent, Contract, CarStatus } from '../types';
import { Save, Printer, X, Search, FileEdit, UserPlus } from 'lucide-react';

interface ContractFormProps {
  cars: Car[];
  agents: Agent[];
  clients: Client[];
  onSubmit: (contract: Omit<Contract, 'id'>) => void;
  onCancel: () => void;
  initialContract?: Contract | null;
}

const ContractForm: React.FC<ContractFormProps> = ({ cars, agents, clients, onSubmit, onCancel, initialContract }) => {
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    paymentMethod: 'Cash' as 'Cash' | 'Card' | 'Transfer',
    selectedClientId: '',
    selectedCarId: '',
    selectedAgentId: '',
  });

  const [total, setTotal] = useState(0);

  // Initialize form if editing
  useEffect(() => {
    if (initialContract) {
      setFormData({
        startDate: initialContract.startDate,
        endDate: initialContract.endDate,
        paymentMethod: initialContract.paymentMethod,
        selectedClientId: initialContract.clientId,
        selectedCarId: initialContract.carId,
        selectedAgentId: initialContract.agentId,
      });
      setTotal(initialContract.totalAmount); 
    }
  }, [initialContract]);

  // Auto-calculate total
  useEffect(() => {
    if (formData.selectedCarId && formData.startDate && formData.endDate) {
      const car = cars.find(c => c.id === formData.selectedCarId);
      if (car) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        setTotal(diffDays * car.dailyPrice);
      }
    }
  }, [formData.selectedCarId, formData.startDate, formData.endDate, cars]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.selectedCarId || !formData.selectedAgentId || !formData.selectedClientId) {
        alert("Please select a client, a car and an agent");
        return;
    }

    const newContract = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalAmount: total,
      paymentMethod: formData.paymentMethod,
      clientId: formData.selectedClientId,
      carId: formData.selectedCarId,
      agentId: formData.selectedAgentId
    };

    onSubmit(newContract);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden max-w-5xl mx-auto animate-fade-in">
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            {initialContract ? <FileEdit className="w-5 h-5 text-ocre" /> : <FileEdit className="w-5 h-5 text-majorelle" />}
            {initialContract ? 'Edit Contract' : 'New Rental Contract'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Dates & Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b border-slate-100">
           <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Rental Period</label>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <span className="text-xs text-slate-500 mb-1 block">Start</span>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-majorelle outline-none" required />
                    </div>
                    <div className="flex-1">
                        <span className="text-xs text-slate-500 mb-1 block">End</span>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-majorelle outline-none" required />
                    </div>
                </div>
           </div>
           
           <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <label className="block text-sm font-medium text-slate-700">Estimated Total Amount</label>
                    <span className="text-2xl font-bold text-majorelle">{total.toLocaleString()} MAD</span>
                </div>
                
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method :</label>
                     <div className="flex gap-6">
                        {['Cash', 'Card', 'Transfer'].map((mode) => (
                            <label key={mode} className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    value={mode} 
                                    checked={formData.paymentMethod === mode} 
                                    onChange={handleChange}
                                    className="w-4 h-4 text-majorelle focus:ring-majorelle border-gray-300"
                                />
                                <span className="ml-2 text-sm text-slate-700">{mode}</span>
                            </label>
                        ))}
                     </div>
                </div>
           </div>
        </div>

        {/* 3 Columns: Client, Car, Agent */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: CLIENT */}
            <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                    <span className="w-1 h-5 bg-ocre rounded-full"></span> CLIENT
                </h3>
                <div className="space-y-3">
                    <select 
                        name="selectedClientId" 
                        value={formData.selectedClientId} 
                        onChange={handleChange}
                        className="w-full p-2 bg-white border border-slate-300 rounded-md text-sm"
                        required
                    >
                        <option value="">-- Select Existing Client --</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.lastName} {c.firstName} ({c.nationalId})</option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-400 italic mt-2">Can't find client? Go to Manage Clients to add them first.</p>
                </div>
            </div>

            {/* Column 2: CAR */}
            <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                    <span className="w-1 h-5 bg-majorelle rounded-full"></span> CAR
                </h3>
                <div className="space-y-4">
                     <div className="relative">
                        <select 
                            name="selectedCarId" 
                            value={formData.selectedCarId} 
                            onChange={handleChange}
                            className="w-full p-2 bg-white border border-slate-300 rounded-md text-sm appearance-none"
                            required
                        >
                            <option value="">-- Select a car --</option>
                            {cars.filter(c => c.status === CarStatus.AVAILABLE || c.id === formData.selectedCarId).map(c => (
                                <option key={c.id} value={c.id}>{c.brand} {c.model} - {c.registration}</option>
                            ))}
                        </select>
                     </div>

                     {formData.selectedCarId && (
                        <div className="bg-white p-3 rounded border border-slate-200 text-sm space-y-2">
                            {(() => {
                                const car = cars.find(c => c.id === formData.selectedCarId);
                                if (!car) return null;
                                return (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Price/Day:</span>
                                            <span className="text-majorelle font-bold">{car.dailyPrice} MAD</span>
                                        </div>
                                        <div className="mt-2 h-24 overflow-hidden rounded">
                                            <img src={car.image} className="w-full h-full object-cover" alt="Car preview" />
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                     )}
                </div>
            </div>

            {/* Column 3: AGENT */}
            <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                    <span className="w-1 h-5 bg-gray-600 rounded-full"></span> AGENT
                </h3>
                <div className="space-y-3">
                     <select 
                        name="selectedAgentId" 
                        value={formData.selectedAgentId} 
                        onChange={handleChange}
                        className="w-full p-2 bg-white border border-slate-300 rounded-md text-sm"
                        required
                    >
                        <option value="">-- Responsible --</option>
                        {agents.map(a => (
                            <option key={a.id} value={a.id}>{a.lastName} {a.firstName}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <X className="w-4 h-4" /> Cancel
            </button>
            <button type="button" onClick={() => window.print()} className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Printer className="w-4 h-4" /> Print
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-lg bg-majorelle text-white font-medium hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2">
                <Save className="w-4 h-4" /> 
                {initialContract ? 'Save Changes' : 'Save Contract'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ContractForm;
