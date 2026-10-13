
import React from 'react';
import { Contract, Client, Car } from '../types';
import { Search, Edit, FileText, Calendar, User, Car as CarIcon, Trash2 } from 'lucide-react';

interface ContractListProps {
  contracts: Contract[];
  clients: Client[];
  cars: Car[];
  onEditContract: (contract: Contract) => void;
  onViewInvoice: (contract: Contract) => void;
  onDeleteContract: (id: string) => void;
}

const ContractList: React.FC<ContractListProps> = ({ contracts, clients, cars, onEditContract, onViewInvoice, onDeleteContract }) => {
  const getClient = (id: string) => clients.find(c => c.id === id) || { lastName: 'Unknown', firstName: '', phone: '' };
  const getCar = (id: string) => cars.find(c => c.id === id) || { brand: 'Unknown', model: '', registration: '' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Contract Management</h2>
          <p className="text-slate-500 text-sm">History and management of ongoing rentals</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Contract No</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Car</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {contracts.map((contract) => {
                    const client = getClient(contract.clientId) as Client;
                    const car = getCar(contract.carId) as Car;
                    
                    return (
                    <tr key={contract.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2 font-mono font-medium text-majorelle">
                                <FileText className="w-4 h-4" />
                                {contract.id}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="font-medium text-slate-800 flex items-center gap-2">
                                    <User className="w-3 h-3 text-slate-400" />
                                    {client.lastName} {client.firstName}
                                </span>
                                <span className="text-xs text-slate-500 pl-5">{client.phone}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                             <div className="flex flex-col">
                                <span className="font-medium text-slate-800 flex items-center gap-2">
                                    <CarIcon className="w-3 h-3 text-slate-400" />
                                    {car.brand} {car.model}
                                </span>
                                <span className="text-xs text-slate-500 pl-5">{car.registration}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{new Date(contract.startDate).toLocaleDateString('en-US')}</span>
                                <span className="text-slate-300">→</span>
                                <span>{new Date(contract.endDate).toLocaleDateString('en-US')}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <span className="font-bold text-slate-800 flex items-center justify-end gap-1">
                                {contract.totalAmount.toLocaleString()} <span className="text-xs font-normal text-slate-500">MAD</span>
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onViewInvoice(contract)} className="p-2 text-slate-500 hover:text-majorelle hover:bg-blue-50 rounded-lg tooltip" title="View Invoice"><FileText className="w-4 h-4" /></button>
                                <button onClick={() => onDeleteContract(contract.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg tooltip" title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </td>
                    </tr>
                )})}
            </tbody>
        </table>
        {contracts.length === 0 && <div className="p-12 text-center text-slate-400">No contract found.</div>}
      </div>
    </div>
  );
};

export default ContractList;
