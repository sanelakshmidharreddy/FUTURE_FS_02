import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getLeadInsights } from '../services/geminiService.ts';

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [insights, setInsights] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/leads', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      setLeads(data);
      getLeadInsights(data).then(setInsights);
    })
    .catch(console.error);
  }, []);

  const stats = [
    { label: 'Total Leads', value: leads.length, change: '+12%', color: 'text-blue-400' },
    { label: 'New', value: leads.filter(l => l.status === 'New').length, change: '+5%', color: 'text-purple-400' },
    { label: 'Converted', value: leads.filter(l => l.status === 'Converted').length, change: '+2%', color: 'text-emerald-400' },
    { label: 'Tasks', value: '4', change: '+1', color: 'text-orange-400' },
  ];

  const chartData = leads.length > 0 ? leads.slice(0, 5).map((l, i) => ({ name: l.name, value: i * 10 })) : [{name: 'No Data', value: 0}];

  const insightItems = insights.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Executive Dashboard</h2>
        <p className="text-neutral-500">Welcome back, here's your AI-powered performance summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface-900/50 backdrop-blur-lg border border-surface-800 p-6 rounded-3xl hover:border-primary/50 transition-all">
            <p className="text-neutral-400 text-sm mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className={`text-4xl font-bold ${stat.color} tracking-tight`}>{stat.value}</span>
              <span className="text-emerald-500 text-sm font-medium">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-900/50 backdrop-blur-lg border border-surface-800 p-8 rounded-3xl h-96">
            <h3 className="text-xl font-semibold text-white mb-6">Pipeline Velocity</h3>
            {isMounted ? (
                <ResponsiveContainer width="100%" height="80%">
                <LineChart data={chartData}>
                    <XAxis dataKey="name" stroke="#525252" />
                    <YAxis stroke="#525252" />
                    <Tooltip contentStyle={{ backgroundColor: '#171717', border: 'none', borderRadius: '16px' }} />
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{r: 6}} />
                </LineChart>
                </ResponsiveContainer>
            ) : <div className="h-full w-full animate-pulse bg-surface-800 rounded-3xl" />}
        </div>
        
        <div className="bg-surface-900/50 backdrop-blur-lg border border-surface-800 p-8 rounded-3xl overflow-y-auto h-96">
                <h3 className="text-xl font-semibold text-white mb-6">AI Priority Insights</h3>
                <div className="space-y-4">
                    {insightItems.length > 0 ? insightItems.map((item, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-surface-950/50 border border-surface-800 text-neutral-300 text-sm">
                            {item}
                        </div>
                    )) : <p className="text-neutral-500">Analyzing data for actionable insights...</p>}
                </div>
        </div>
      </div>
    </div>
  );
}
