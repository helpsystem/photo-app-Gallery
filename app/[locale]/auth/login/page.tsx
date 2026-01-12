'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Math Captcha State
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Verify Captcha
    if (parseInt(captchaAnswer) !== num1 + num2) {
      toast.error('Incorrect Security Check');
      setLoading(false);
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      toast.success(t('loginSuccess'));
      router.push(`/${locale}/admin`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-black">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex min-h-screen items-center justify-center p-4"
      >
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
          <div className="p-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-white">Ram<span className="text-cyan-400">Family</span></h2>
              <p className="text-gray-400">{t('login')}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t('email')}
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 opacity-20 transition duration-500 group-hover:opacity-50"></div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@ramfamily.com"
                      className="border-gray-700 bg-gray-900/50 pl-10 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  {t('password')}
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 opacity-20 transition duration-500 group-hover:opacity-50"></div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="border-gray-700 bg-gray-900/50 pl-10 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Bot Protection: Math Captcha */}
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <label className="mb-2 block text-sm font-medium text-gray-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Security Check
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-white font-mono text-lg">{num1} + {num2} = ?</span>
                  <Input
                    type="number"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="Ans"
                    className="w-20 border-gray-700 bg-gray-900/50 text-center text-white focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 py-6 text-lg font-semibold text-white transition-all hover:from-cyan-500 hover:to-purple-500 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('signingIn')}
                  </>
                ) : (
                  t('signIn')
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Protected by RamFamily Security System
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}