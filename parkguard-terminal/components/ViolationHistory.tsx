
import React from 'react';
import { Violation } from '../types';
import { FileText, CheckCircle, Clock, AlertTriangle, MapPin } from 'lucide-react';

interface Props {
  violations: Violation[];
}

const ViolationHistory: React.FC<Props> = ({ violations }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
          <AlertTriangle className="text-red-500 w-5 h-5" />
          Recent Violations
        </h2>
        <span className="bg-red-50 text-red-500 text-[10px] font-bold px-3 py-1 rounded-full border border-red-100 uppercase tracking-wider">
          Live Feed Active
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Plate Number</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Fine</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Evidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {violations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-400 font-medium">
                  No violations detected yet today.
                </td>
              </tr>
            ) : (
              violations.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="font-mono bg-white text-slate-900 px-3 py-1 rounded-lg border border-slate-200 text-sm font-bold shadow-sm">
                      {v.plateNumber}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap font-bold text-slate-900">
                    {v.ownerName}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-xs text-slate-500">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1 font-medium"><Clock className="w-3 h-3 text-slate-400"/> {v.timestamp}</span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider"><MapPin className="w-3 h-3"/> {v.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-red-500 font-black">
                    ₹{v.fineAmount}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${
                      v.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {v.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <button className="text-slate-900 hover:text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-colors group">
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
                      View Challan
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViolationHistory;
