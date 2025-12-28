'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from './actions';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setError('');

        const formData = new FormData();
        formData.append('password', password);

        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setIsPending(false);
        } else {
            router.push('/audit');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-xl shadow-blue-600/20">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Legal Intelligence Portal</h1>
                    <p className="text-slate-400">Please enter your credentials to continue</p>
                </div>

                <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Access Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                'Secure Access'
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} Meris Labs. All rights reserved.
                </p>
            </div>
        </div>
    );
}
