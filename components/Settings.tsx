
import React, { useState } from 'react';
import { AgencySettings } from '../types';
import { Save, Printer } from 'lucide-react';

interface SettingsProps {
    settings: AgencySettings;
    onUpdate: (s: AgencySettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
    const [formData, setFormData] = useState(settings);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
        alert("Settings updated!");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
             <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Agency Settings</h2>
                    <p className="text-slate-500 text-sm">Configuration and contact details</p>
                </div>
                <button onClick={() => window.print()} className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-900 transition-colors">
                    <Printer className="w-4 h-4" /> Print Data
                </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Agency Name</label>
                        <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-majorelle outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                        <textarea className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-majorelle outline-none" rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-majorelle outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-majorelle outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Currency Symbol</label>
                        <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-majorelle outline-none max-w-xs" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button type="submit" className="bg-majorelle text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-800 shadow-lg shadow-blue-900/20 font-bold transition-transform active:scale-95">
                            <Save className="w-4 h-4" /> Save Configuration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
