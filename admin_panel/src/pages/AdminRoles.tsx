import { useState } from 'react';
import { mockStaff } from '../mocks/data';
import { Staff } from '../mocks/types';
import { UserPlus, Shield, Check, X } from 'lucide-react';

export function AdminRoles() {
  const [staffList, setStaffList] = useState<Staff[]>(mockStaff);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'Support Staff' });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    setStaffList([...staffList, { 
      id: `s${Date.now()}`, 
      ...newStaff, 
      role: newStaff.role as any,
      status: 'active' 
    }]);
    
    setIsAddModalOpen(false);
    setNewStaff({ name: '', email: '', role: 'Support Staff' });
  };

  const toggleStatus = (id: string) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
  };

  const permissions = [
    { feature: 'View Dashboard', roles: ['Super Admin', 'Finance', 'Support Staff'] },
    { feature: 'Manage Users', roles: ['Super Admin', 'Support Staff'] },
    { feature: 'Manage Pricing', roles: ['Super Admin'] },
    { feature: 'Manage Transactions', roles: ['Super Admin', 'Finance'] },
    { feature: 'Send Broadcasts', roles: ['Super Admin', 'Support Staff'] },
    { feature: 'Aggregator Settings', roles: ['Super Admin'] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Admin Roles & Permissions</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#1B3A6B] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2A5A9E] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#1B3A6B]" />
            <h3 className="text-lg font-bold text-gray-900">Staff Accounts</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {staffList.map((staff) => (
              <div key={staff.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    staff.role === 'Super Admin' ? 'bg-[#1B3A6B]' :
                    staff.role === 'Finance' ? 'bg-green-600' : 'bg-blue-400'
                  }`}>
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{staff.name}</h4>
                    <p className="text-xs text-gray-500">{staff.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {staff.role}
                  </span>
                  <button 
                    onClick={() => toggleStatus(staff.id)}
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      staff.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {staff.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Matrix (Read-only) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Permissions Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-3 px-4 font-semibold text-gray-600">Feature</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-center">Super Admin</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-center">Finance</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-center">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {permissions.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-700 font-medium">{p.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {p.roles.includes('Super Admin') ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {p.roles.includes('Finance') ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {p.roles.includes('Support Staff') ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Add New Staff</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" required
                  value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" required
                  value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] outline-none"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Finance">Finance</option>
                  <option value="Support Staff">Support Staff</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button" onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newStaff.name || !newStaff.email}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1B3A6B] rounded-lg disabled:opacity-50"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
