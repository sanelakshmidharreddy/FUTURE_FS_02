import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Save, LogOut } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ username: '', email: '', avatar: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  const generateDemoData = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/seed', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to seed');
        setMessage({ text: 'Demo data generated!', type: 'success' });
    } catch {
        setMessage({ text: 'Failed to generate demo data.', type: 'error' });
    } finally {
        setIsLoading(false);
        setTimeout(() => setMessage(null), 3000);
    }
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/auth/profile', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => setProfile({ 
          username: data.username || '', 
          email: data.email || '', 
          avatar: data.avatar || '',
          password: '' 
      }));
  }, []);

  const handleUpdate = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(profile),
      });
      if (!response.ok) throw new Error('Failed to update');
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to update profile.', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfile(prev => ({ ...prev, avatar: e.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Settings</h2>
      
      {message && (
        <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 space-y-6">
        <section>
          <h3 className="text-lg font-bold text-white mb-4">Profile</h3>
          <div className="flex items-center gap-4">
             {profile.avatar ? (
                <img src={profile.avatar} className="w-16 h-16 rounded-full bg-surface-800 object-cover" />
             ) : (
                <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-neutral-500" />
                </div>
             )}
             <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
             <button onClick={() => fileInputRef.current?.click()} className="text-sm px-4 py-2 border border-surface-800 rounded-xl hover:bg-surface-800 transition">Change Avatar</button>
          </div>
          <div className="grid gap-4 mt-4">
              <input value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} placeholder="Username" className="p-3 bg-surface-950 border border-surface-800 rounded-xl text-white" />
              <input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} placeholder="Email" className="p-3 bg-surface-950 border border-surface-800 rounded-xl text-white" />
              <input type="password" value={profile.password} onChange={e => setProfile({...profile, password: e.target.value})} placeholder="New Password" className="p-3 bg-surface-950 border border-surface-800 rounded-xl text-white" />
          </div>
        </section>

        <section className="flex items-center gap-4">
          <button onClick={handleUpdate} disabled={isLoading} className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl disabled:opacity-50 transition">
            <Save className="w-5 h-5" />
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
          <button onClick={generateDemoData} disabled={isLoading} className="flex items-center gap-2 bg-surface-800 text-white px-6 py-2 rounded-xl hover:bg-surface-700 disabled:opacity-50 transition">
             Generate Demo Data
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-rose-500 hover:text-rose-400 transition">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </section>
      </div>
    </div>
  );
}
