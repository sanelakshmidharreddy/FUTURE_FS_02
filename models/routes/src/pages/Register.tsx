import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Registration failed');
      navigate('/login');
    } catch (error) {
      setError('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-950">
      <div className="flex-1 flex flex-col justify-center px-12">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center p-1.5"><div className="w-full h-full bg-surface-950 rounded-md" /></div>
            <span className="text-xl font-bold tracking-tight text-white">Nexus CRM</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Create an account</h2>
            <p className="text-neutral-500 mt-2">Get started and streamline your lead management.</p>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 bg-surface-900 border border-surface-800 rounded-xl " />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 bg-surface-900 border border-surface-800 rounded-xl" />
            <button type="submit" disabled={loading} className="w-full bg-primary text-white p-3 rounded-xl font-medium hover:bg-primary-dark transition-colors">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="text-neutral-500 text-sm italic">Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></p>
        </div>
      </div>
      <div className="hidden lg:block flex-1 bg-gradient-to-br from-primary/20 to-accent/20" />
    </div>
  );
}
