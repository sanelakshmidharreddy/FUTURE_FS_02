import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#c084fc', '#f472b6'];

export default function Analytics() {
  const [data, setData] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Mimic API fetch for chart data (replace with actual fetch if endpoint exists)
    setData([
      { name: 'Jan', leads: 40, converted: 24 },
      { name: 'Feb', leads: 30, converted: 13 },
      { name: 'Mar', leads: 98, converted: 60 },
      { name: 'Apr', leads: 39, converted: 20 },
      { name: 'May', leads: 48, converted: 30 },
    ]);
  }, []);

  if (!isMounted) return <div className="p-8"><div className="w-full h-96 animate-pulse bg-surface-800 rounded-3xl" /></div>;

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-3xl font-bold text-white">Advanced Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-900/50 backdrop-blur-lg border border-surface-800 p-8 rounded-3xl">
          <h3 className="text-xl font-semibold text-white mb-6">Lead Growth Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="name" stroke="#525252" />
                <YAxis stroke="#525252" />
                <Tooltip contentStyle={{ backgroundColor: '#171717', border: 'none', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="leads" stroke="#6366f1" fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-surface-900/50 backdrop-blur-lg border border-surface-800 p-8 rounded-3xl">
          <h3 className="text-xl font-semibold text-white mb-6">Conversion Analytics</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="name" stroke="#525252" />
                <YAxis stroke="#525252" />
                <Tooltip contentStyle={{ backgroundColor: '#171717', border: 'none', borderRadius: '16px' }} />
                <Bar dataKey="converted" fill="#c084fc" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-900/50 backdrop-blur-lg border border-surface-800 p-8 rounded-3xl md:col-span-2">
            <h3 className="text-xl font-semibold text-white mb-6">Lead Source Distribution</h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={[{name: 'Direct', value: 400}, {name: 'Social', value: 300}, {name: 'Email', value: 300}]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5}>
                            {COLORS.map((entry, index) => <Cell key={`cell-${index}`} fill={entry} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#171717', border: 'none', borderRadius: '16px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}
