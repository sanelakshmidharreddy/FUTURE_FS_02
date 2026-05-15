import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, UserPlus, LogIn, Filter, RefreshCw, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Activity() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
        const response = await fetch('/api/activities', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        // Add icons based on action type
        setItems(data.map((a: any) => ({
            ...a,
            icon: a.action.includes('Created') ? UserPlus : a.action.includes('Converted') ? CheckCircle2 : LogIn,
            color: a.action.includes('Created') ? 'text-blue-500' : a.action.includes('Converted') ? 'text-emerald-500' : 'text-purple-500'
        })));
        toast.success('Activities refreshed!');
    } catch (e) {
        console.error(e);
        toast.error('Failed to refresh activities');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Recent Activity</h2>
        <div className="flex gap-2">
            <button className={`p-2 border border-surface-800 rounded-xl text-neutral-400 hover:text-white ${loading ? 'opacity-50' : ''}`} onClick={fetchActivities} disabled={loading}><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
            <button className="p-2 border border-surface-800 rounded-xl text-neutral-400 hover:text-white" onClick={() => setIsExpanded(true)}><Maximize2 className="w-5 h-5" /></button>
        </div>
      </div>
      
      <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 shadow-xl">
        <div className="space-y-6">
          {loading ? <div className="text-neutral-500 text-center py-8">Loading...</div> : items.map((activity: any) => (
            <div key={activity._id} className="flex items-center gap-4 p-4 rounded-xl">
              <div className={`p-2 rounded-lg bg-surface-950 ${activity.color}`}>
                <activity.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.action}</p>
                <p className="text-neutral-500 text-sm">{new Date(activity.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-surface-950/90 backdrop-blur-md z-50 flex items-center justify-center p-8">
                <div className="bg-surface-900 border border-surface-800 w-full max-w-4xl p-8 rounded-3xl relative">
                    <button onClick={() => setIsExpanded(false)} className="absolute top-4 right-4 text-white"><X /></button>
                    <h2 className="text-2xl font-bold text-white mb-6">Activity Log</h2>
                    <div className="space-y-4">
                      {items.map((activity: any) => (
                        <div key={activity._id} className="flex items-center gap-4 p-4 border border-surface-800 rounded-xl">
                          <activity.icon className={`w-5 h-5 ${activity.color}`} />
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-neutral-500 ml-auto">{new Date(activity.createdAt).toLocaleTimeString()}</p>
                        </div>
                      ))}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
