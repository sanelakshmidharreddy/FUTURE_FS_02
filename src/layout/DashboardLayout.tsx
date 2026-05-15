import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Activity, Settings, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Logo = ({ className = "w-8 h-8", rounded = "rounded-xl" }: { className?: string, rounded?: string }) => (
  <div className={`relative flex items-center justify-center ${className} ${rounded} bg-gradient-to-br from-blue-600 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]`}>
    <svg className="w-1/2 h-1/2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l8 16 8-16" />
    </svg>
  </div>
);

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/profile', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(setProfile);
    fetch('/api/notifications', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(setNotifications);
  }, []);

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
  };
    
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Activity', path: '/activity', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-surface-950 text-neutral-200 flex font-sans">
      <aside className="w-64 border-r border-surface-800 bg-surface-900/50 backdrop-blur-xl flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-xl font-bold tracking-tight text-white">Nexus CRM</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-surface-800 text-white shadow-lg shadow-primary/10 ring-1 ring-primary/20' : 'text-neutral-500 hover:text-neutral-200 hover:bg-surface-800/50'}`}>
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                <span className="font-medium">{item.name}</span>
                {isActive && <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-800">
           <Link to="/settings" className={`group flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${pathname === '/settings' ? 'text-white bg-surface-800 ring-1 ring-primary/20' : 'text-neutral-500 hover:text-neutral-200 hover:bg-surface-800/50'}`}>
            <Settings className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-surface-800 flex items-center justify-between px-8 bg-surface-950/50 backdrop-blur-md sticky top-0 z-10">
          <div />
          <div className="flex items-center gap-4 relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-neutral-500 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />}
            </button>
            {showNotifications && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-12 right-12 w-72 bg-surface-900 border border-surface-800 rounded-2xl shadow-xl p-4 text-sm space-y-2 z-50">
                    <p className="font-bold text-white text-base mb-2">Notifications</p>
                    {notifications.length === 0 ? <p className="text-neutral-400 text-center py-4">No new notifications</p> : notifications.map(n => (
                        <div key={n._id} onClick={() => markAsRead(n._id)} className={`p-3 rounded-lg cursor-pointer ${n.read ? 'opacity-50' : 'bg-surface-800'} hover:bg-surface-700 transition`}>
                            {n.message}
                        </div>
                    ))}
                </motion.div>
            )}
            
            <div onClick={() => setShowProfile(!showProfile)} className="cursor-pointer rounded-full p-0.5 border border-surface-700 hover:border-primary transition-all">
                <Logo className="w-8 h-8" rounded="rounded-full" />
            </div>
            
            {showProfile && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-12 right-0 w-48 bg-surface-900 border border-surface-800 rounded-2xl shadow-xl p-2 text-sm z-50">
                    <div className="px-4 py-2 text-neutral-400 border-b border-surface-800 mb-1">
                        <p className="font-bold text-white">{profile?.username || 'User'}</p>
                        <p className="text-xs">{profile?.email}</p>
                    </div>
                    <Link to="/settings" className="block px-4 py-2 hover:bg-surface-800 rounded-lg hover:text-white transition">My Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 hover:bg-surface-800 rounded-lg hover:text-white transition">Settings</Link>
                    <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="block w-full text-left px-4 py-2 hover:bg-surface-800 rounded-lg text-rose-500 hover:bg-rose-950/20 transition">Logout</button>
                </motion.div>
            )}
          </div>
        </header>
        <div className="p-8 flex-1 overflow-auto bg-surface-950">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
