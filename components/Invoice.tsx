import React from 'react';
import { Contract, Client, Car, Agent } from '../types';
import { ArrowLeft, Printer } from 'lucide-react';

interface ExtendedContract extends Contract {
  client: Client;
  car: Car;
  agent: Agent;
}

interface InvoiceProps {
  contract: ExtendedContract;
  onBack: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ contract, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto my-8 animate-fade-in">
      {/* Action Bar (No Print) */}
      <div className="no-print flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-majorelle transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center bg-majorelle text-white px-6 py-2 rounded-lg hover:bg-blue-800 shadow-md transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" /> Print Invoice
        </button>
      </div>

      {/* Invoice Paper */}
      <div className="bg-white p-12 shadow-2xl print:shadow-none print:p-0 mx-auto text-slate-900 font-serif w-full max-w-[210mm] min-h-[297mm] relative">
        
        {/* Header */}
        <div className="text-center mb-12">
            <h1 className="text-4xl font-black uppercase tracking-widest text-slate-900 mb-2">Rental Invoice</h1>
            <h2 className="text-xl font-bold uppercase text-slate-600 tracking-wide">FastCar El Bahja Car Rental Agency</h2>
            <div className="w-full h-1 bg-slate-800 mt-4 mb-1"></div>
            <div className="w-full h-0.5 bg-slate-800"></div>
        </div>

        {/* Contract Section */}
        <div className="mb-8">
            <h3 className="text-lg font-bold uppercase border-b-2 border-slate-800 pb-1 mb-3 w-fit">Contract</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>
                    <span className="font-bold">Contract No : </span> 
                    <span className="font-mono">{contract.id}</span>
                </div>
                <div></div>
                <div>
                    <span className="font-bold">Start Date : </span> 
                    <span>{contract.startDate}</span>
                </div>
                <div>
                    <span className="font-bold">End Date : </span> 
                    <span>{contract.endDate}</span>
                </div>
                <div>
                    <span className="font-bold">Total Amount : </span> 
                    <span className="text-lg font-bold">{contract.totalAmount.toLocaleString()} MAD</span>
                </div>
                 <div>
                    <span className="font-bold">Payment : </span> 
                    <span>{contract.paymentMethod}</span>
                </div>
            </div>
            <div className="border-b border-slate-300 mt-4"></div>
        </div>

        {/* Client Section */}
        <div className="mb-8">
            <h3 className="text-lg font-bold uppercase border-b-2 border-slate-800 pb-1 mb-3 w-fit">Client</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>
                    <span className="font-bold w-24 inline-block">National ID</span> : {contract.client.nationalId}
                </div>
                <div>
                    <span className="font-bold w-24 inline-block">Last Name</span> : {contract.client.lastName}
                </div>
                <div>
                    <span className="font-bold w-24 inline-block">Address</span> : {contract.client.address}
                </div>
                 <div>
                    <span className="font-bold w-24 inline-block">First Name</span> : {contract.client.firstName}
                </div>
                <div>
                    <span className="font-bold w-24 inline-block">Phone</span> : {contract.client.phone}
                </div>
                <div>
                    <span className="font-bold w-24 inline-block">Email</span> : {contract.client.email}
                </div>
            </div>
            <div className="border-b border-slate-300 mt-4"></div>
        </div>

        {/* Car & Agent Row */}
        <div className="grid grid-cols-2 gap-12 mb-12">
            {/* Voiture */}
            <div>
                 <h3 className="text-lg font-bold uppercase border-b-2 border-slate-800 pb-1 mb-3">Car</h3>
                 <div className="space-y-2 text-sm">
                    <p><span className="font-bold">Registration : </span> {contract.car.registration}</p>
                    <p><span className="font-bold">Brand : </span> {contract.car.brand}</p>
                    <p><span className="font-bold">Model : </span> {contract.car.model}</p>
                    <p><span className="font-bold">Daily Price : </span> {contract.car.dailyPrice.toLocaleString()} MAD</p>
                    <p><span className="font-bold">Mileage : </span> {contract.car.mileage.toLocaleString()} km</p>
                    <p><span className="font-bold">Condition : </span> {contract.car.condition}</p>
                 </div>
            </div>

            {/* Agent */}
            <div>
                 <h3 className="text-lg font-bold uppercase border-b-2 border-slate-800 pb-1 mb-3">Agent</h3>
                 <div className="space-y-2 text-sm">
                    <p><span className="font-bold">Agent No : </span> {contract.agent.id}</p>
                    <p><span className="font-bold">Last Name : </span> {contract.agent.lastName}</p>
                    <p><span className="font-bold">First Name : </span> {contract.agent.firstName}</p>
                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <p className="text-xs text-center italic">Signature & Stamp</p>
                    </div>
                 </div>
            </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-12 right-12 text-center text-xs text-slate-600 border-t border-slate-800 pt-4">
             <p className="font-bold mb-1">Head Office : Bd Mohammed V, Guéliz, Marrakech</p>
             <p>Tel : 05 24 33 44 55 | RC : 123456 | License : 78901234 | IF : 98765432</p>
             <p className="mt-2 font-bold text-sm uppercase">Thank you for your trust!</p>
        </div>

      </div>
    </div>
  );
};

export default Invoice;