'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useLanguage } from '@/components/LanguageProvider';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();
  const { t, language } = useLanguage();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
      }
      
      router.push('/tools');
      router.refresh();
    } catch (err: any) {
      setError(err.message || t('login_error_general'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/tools`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(t('login_error_google'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-10 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* تأثيرات التوهج في الخلفية */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 relative z-10 shadow-2xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-cairo">
            {isLogin ? t('login_title_text') : t('signup_title_text')}
          </h1>
          <p className="text-sm text-gray-400">
            {isLogin ? t('login_subtitle') : t('signup_subtitle')}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-300">{t('name_label')}</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/30 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                placeholder={t('name_ph')}
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-300">{t('login_email')}</label>
            <div className="relative">
              <Mail className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500`} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-black/30 border border-gray-800 text-white rounded-xl py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                placeholder="name@example.com"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-300">{t('login_pass')}</label>
            <div className="relative">
              <Lock className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500`} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-black/30 border border-gray-800 text-white rounded-xl py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                placeholder="••••••••"
                dir="ltr"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all flex justify-center items-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? t('login_submit') : t('signup_submit'))}
          </button>
        </form>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-800"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm font-bold">{t('or')}</span>
          <div className="flex-grow border-t border-gray-800"></div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-all flex justify-center items-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t('continue_google')}
        </button>

        <div className="text-center pt-2">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-pink-400 font-bold transition-colors text-sm"
          >
            {isLogin ? t('no_account_msg') : t('has_account_msg')}
          </button>
        </div>
        
        <div className="text-center pt-4">
           <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
             <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-0' : 'rotate-180'}`} /> {t('back_home')}
           </Link>
        </div>
      </div>
    </div>
  );
}