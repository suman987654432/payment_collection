import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ id: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Predefined ID and Password as per requirement
        if (credentials.id === 'admin' && credentials.password === 'admin123') {
            onLogin(true);
            localStorage.setItem('isAdmin', 'true');
        } else {
            setError('Invalid ID or Password');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-800">Admin Portal</h2>
                    <p className="text-slate-500 mt-2">Login to manage registrations</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <User size={16} /> Admin ID
                        </label>
                        <input
                            type="text"
                            value={credentials.id}
                            onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="admin"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Lock size={16} /> Password
                        </label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
