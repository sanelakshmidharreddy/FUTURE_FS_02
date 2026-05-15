import { useState, useEffect } from 'react';
import { Trash2, Search, PlusCircle } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const fetchLeads = () => {
    fetch('/api/leads', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => setLeads(data));
  };
  useEffect(fetchLeads, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedLeads = [...leads]
    .filter(l => statusFilter === 'All' || l.status === statusFilter)
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  const addLead = async () => {
    if (!name || !email) return;
    await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ name, email, phone, company }),
    });
    setName(''); setEmail(''); setPhone(''); setCompany('');
    fetchLeads();
  };

  const deleteLead = async (id: string) => {
    await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetchLeads();
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status: newStatus }),
    });
    fetchLeads();
  };

  const startEdit = (id: string, field: string, value: string) => {
    setEditingId(id);
    setEditingField(field);
    setEditValue(value);
  };

  const saveEdit = async (id: string, field: string) => {
    await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ [field]: editValue }),
    });
    setEditingId(null);
    setEditingField(null);
    fetchLeads();
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Leads Management</h2>
          <p className="text-neutral-400">Manage your entire sales pipeline.</p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20">
          <PlusCircle className="w-5 h-5" /> Add New Lead
        </button>
      </div>

      <div className="bg-surface-900/50 backdrop-blur-lg border border-surface-800 rounded-3xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Lead Name" className="p-4 bg-surface-950 border border-surface-800 rounded-2xl text-white placeholder-neutral-600 focus:border-primary outline-none" />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="p-4 bg-surface-950 border border-surface-800 rounded-2xl text-white placeholder-neutral-600 focus:border-primary outline-none" />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="p-4 bg-surface-950 border border-surface-800 rounded-2xl text-white placeholder-neutral-600 focus:border-primary outline-none" />
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" className="p-4 bg-surface-950 border border-surface-800 rounded-2xl text-white placeholder-neutral-600 focus:border-primary outline-none" />
        </div>
        <button onClick={addLead} className="bg-surface-800 hover:bg-surface-700 text-white px-8 py-3 rounded-2xl transition-all">Create Record</button>
      </div>
      
      <div className="bg-surface-900/50 backdrop-blur-lg border border-surface-800 rounded-3xl p-2 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input placeholder="Search records by name, email, or company..." className="w-full pl-12 p-4 bg-surface-950 border-none rounded-2xl text-white placeholder-neutral-600 outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-surface-950 border border-surface-800 rounded-2xl text-white px-6">
            <option value="All">All Stages</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
        </select>
      </div>

      <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-800 text-neutral-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>Name</th>
              <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('email')}>Email</th>
              <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('phone')}>Phone</th>
              <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('company')}>Company</th>
              <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('status')}>Status</th>
              <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('score')}>AI Score</th>
              <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('priority')}>Priority</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-surface-800">
            {sortedLeads.map(lead => (
              <tr key={lead._id} className="hover:bg-surface-800/50 transition-colors">
                <td className="px-6 py-4 text-white font-medium cursor-pointer" onClick={() => startEdit(lead._id, 'name', lead.name)}>
                  {editingId === lead._id && editingField === 'name' ? (
                    <input value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => saveEdit(lead._id, 'name')} autoFocus className="bg-surface-950 p-1 rounded border border-surface-700 w-full" />
                  ) : lead.name}
                </td>
                <td className="px-6 py-4 text-neutral-400 cursor-pointer" onClick={() => startEdit(lead._id, 'email', lead.email)}>
                  {editingId === lead._id && editingField === 'email' ? (
                   <input value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => saveEdit(lead._id, 'email')} autoFocus className="bg-surface-950 p-1 rounded border border-surface-700 w-full" />
                  ) : lead.email}
                </td>
                <td className="px-6 py-4 text-neutral-400 cursor-pointer" onClick={() => startEdit(lead._id, 'phone', lead.phone)}>
                  {editingId === lead._id && editingField === 'phone' ? (
                   <input value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => saveEdit(lead._id, 'phone')} autoFocus className="bg-surface-950 p-1 rounded border border-surface-700 w-full" />
                  ) : lead.phone}
                </td>
                 <td className="px-6 py-4 text-neutral-400 cursor-pointer" onClick={() => startEdit(lead._id, 'company', lead.company)}>
                  {editingId === lead._id && editingField === 'company' ? (
                   <input value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => saveEdit(lead._id, 'company')} autoFocus className="bg-surface-950 p-1 rounded border border-surface-700 w-full" />
                  ) : lead.company}
                </td>
                <td className="px-6 py-4">
                  <select value={lead.status} onChange={e => updateStatus(lead._id, e.target.value)} className="bg-surface-950 p-2 rounded-lg border border-surface-700 text-xs text-white">
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-neutral-200">
                  <span className={`px-2 py-1 rounded-full text-xs ${lead.score > 70 ? 'bg-emerald-900 text-emerald-300' : 'bg-surface-800'}`}>{lead.score}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${lead.priority === 'High' ? 'bg-rose-900 text-rose-300' : lead.priority === 'Medium' ? 'bg-amber-900 text-amber-300' : 'bg-surface-800 text-neutral-300'}`}>{lead.priority}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => deleteLead(lead._id)} className="text-neutral-500 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
