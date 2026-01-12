'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { createUser } from '@/app/actions/users';
import { Loader2, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage({ params: { locale } }: { params: { locale: string } }) {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const router = useRouter();

    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        setNum1(Math.floor(Math.random() * 10));
        setNum2(Math.floor(Math.random() * 10));
        setCaptchaAnswer('');
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (parseInt(captchaAnswer) !== num1 + num2) {
            toast.error('Incorrect Security Check');
            setLoading(false);
            generateCaptcha();
            return;
        }

        try {
            await createUser(formData);
            toast.success('Account created! Please login.');
            router.push(`/${locale}/auth/login`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80')] bg-cover bg-center"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
            >
                <h2 className="text-3xl font-bold text-center text-white mb-2">Join <span className="text-cyan-400">RamFamily</span></h2>
                <p className="text-gray-400 text-center mb-8">Create your account</p>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Full Name"
                            className="pl-10 bg-white/5 border-white/10 text-white"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <Input
                            type="email"
                            placeholder="Email Address"
                            className="pl-10 bg-white/5 border-white/10 text-white"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <Input
                            type="password"
                            placeholder="Password"
                            className="pl-10 bg-white/5 border-white/10 text-white"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center justify-between">
                        <span className="text-gray-300 text-sm flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            {num1} + {num2} = ?
                        </span>
                        <Input
                            className="w-20 text-center bg-black/50 border-white/10 text-white"
                            value={captchaAnswer}
                            onChange={e => setCaptchaAnswer(e.target.value)}
                            placeholder="Ans"
                            required
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 py-6 text-lg">
                        {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Already have an account? <a href={`/${locale}/auth/login`} className="text-cyan-400 hover:underline">Login</a>
                </p>
            </motion.div>
        </div>
    );
}
