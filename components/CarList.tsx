
import React, { useState } from 'react';
import { Car, CarStatus, Agent } from '../types';
import { Edit, Trash2, Search, PlusCircle, CheckCircle, UserPlus } from 'lucide-react';

interface CarListProps {
  cars: Car[];
  agents: Agent[];
  onSelectCar?: (car: Car) => void;
  onAddCar: (car: Omit<Car, 'id'>) => void;
  onUpdateCar: (id: string, car: Partial<Car>) => void;
  onDeleteCar: (id: string) => void;
}

const CarList: React.FC<CarListProps> = ({ cars, agents, onSelectCar, onAddCar, onUpdateCar, onDeleteCar }) => {
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Car>>({
        brand: '', model: '', registration: '', dailyPrice: 0, status: CarStatus.AVAILABLE, mileage: 0, image: '', condition: 'Good', agentId: ''
    });

    const filteredCars = filterStatus === 'All' ? cars : cars.filter(c => c.status === filterStatus);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const carData = { ...formData } as any;
        if (editingId) {
            onUpdateCar(editingId, carData);
        } else {
            // Default image if empty
            if (!carData.image) carData.image = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800';
            onAddCar(carData);
        }
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ brand: '', model: '', registration: '', dailyPrice: 0, status: CarStatus.AVAILABLE, mileage: 0, image: '', condition: 'Good', agentId: '' });
    };

    const handleEdit = (car: Car) => {
        setFormData(car);
        setEditingId(car.id);
        setIsFormOpen(true);
    };

    return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Vehicle Fleet</h2>
          <p className="text-slate-500 text-sm">Manage your luxury vehicle fleet</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
             <select 
                className="p-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-majorelle"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
             >
                 <option value="All">All Status</option>
                 <option value={CarStatus.AVAILABLE}>{CarStatus.AVAILABLE}</option>
                 <option value={CarStatus.RENTED}>{CarStatus.RENTED}</option>
                 <option value={CarStatus.MAINTENANCE}>{CarStatus.MAINTENANCE}</option>
             </select>
            <button onClick={() => { setEditingId(null); setIsFormOpen(!isFormOpen); }} className="bg-majorelle hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md shadow-blue-900/20">
                <PlusCircle className="w-4 h-4" /> {isFormOpen ? 'Cancel' : 'Add Vehicle'}
            </button>
        </div>
      </div>

      {isFormOpen && (
          <div className="bg-white p-6 rounded-xl shadow border border-blue-100 mb-6">
               <h3 className="font-bold text-majorelle mb-4 border-b pb-2">{editingId ? 'Edit Vehicle' : 'New Vehicle'}</h3>
               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input className="p-2 border rounded" placeholder="Brand" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} required />
                    <input className="p-2 border rounded" placeholder="Model" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} required />
                    <input className="p-2 border rounded" placeholder="Registration" value={formData.registration} onChange={e => setFormData({...formData, registration: e.target.value})} required />
                    <input className="p-2 border rounded" type="number" placeholder="Price/Day" value={formData.dailyPrice || ''} onChange={e => setFormData({...formData, dailyPrice: Number(e.target.value)})} required />
                    <input className="p-2 border rounded" type="number" placeholder="Mileage" value={formData.mileage || ''} onChange={e => setFormData({...formData, mileage: Number(e.target.value)})} required />
                    <select className="p-2 border rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as CarStatus})}>
                        {Object.values(CarStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input className="p-2 border rounded" placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                    <input className="p-2 border rounded" placeholder="Condition" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} />
                    
                    <div className="flex flex-col">
                        <select className="p-2 border rounded h-full" value={formData.agentId || ''} onChange={e => setFormData({...formData, agentId: e.target.value})}>
                            <option value="">-- Assign to Agent --</option>
                            {agents.map(a => <option key={a.id} value={a.id}>{a.lastName} {a.firstName}</option>)}
                        </select>
                    </div>

                    <div className="lg:col-span-3 flex justify-end gap-2 pt-4">
                        <button type="submit" className="bg-majorelle text-white px-6 py-2 rounded hover:bg-blue-800">Save Vehicle</button>
                    </div>
               </form>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div key={car.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-100 overflow-hidden flex flex-col">
            <div className="h-48 overflow-hidden relative group">
              <img 
                src={car.image} 
                alt={`${car.brand} ${car.model}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md
                    ${car.status === CarStatus.AVAILABLE ? 'bg-green-500/90 text-white' : ''}
                    ${car.status === CarStatus.RENTED ? 'bg-ocre/90 text-white' : ''}
                    ${car.status === CarStatus.MAINTENANCE ? 'bg-slate-500/90 text-white' : ''}
                `}>
                    {car.status}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">{car.brand}</h3>
                    <p className="text-slate-500">{car.model}</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-majorelle">{car.dailyPrice} MAD</p>
                    <p className="text-xs text-slate-400">/ day</p>
                </div>
              </div>
              
              <div className="border-t border-slate-100 my-4 pt-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                    <span>Registration:</span>
                    <span className="font-mono font-medium text-slate-800 bg-slate-100 px-2 rounded">{car.registration}</span>
                </div>
                <div className="flex justify-between">
                    <span>Mileage:</span>
                    <span>{car.mileage.toLocaleString()} km</span>
                </div>
                {car.agentId && (
                    <div className="flex justify-between items-center text-purple-600">
                        <span className="flex items-center gap-1"><UserPlus className="w-3 h-3" /> Agent:</span>
                        <span className="font-medium">
                            {(() => {
                                const a = agents.find(ag => ag.id === car.agentId);
                                return a ? `${a.lastName}` : 'Unknown';
                            })()}
                        </span>
                    </div>
                )}
              </div>

              <div className="mt-auto pt-4 flex gap-2">
                 <button onClick={() => handleEdit(car)} className="flex-1 p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex justify-center items-center gap-2 transition-colors">
                    <Edit className="w-4 h-4" /> Edit
                </button>
                 <button onClick={() => onDeleteCar(car.id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarList;
