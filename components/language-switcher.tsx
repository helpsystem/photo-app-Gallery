'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { locales } from '@/i18n';

const languageNames: Record<string, string> = {
  fa: 'فارسی',
  en: 'English',
  es: 'Español',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="relative group">
      <button className="glass-strong flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white hover:text-purple-400 transition-colors">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{languageNames[locale] || locale}</span>
      </button>
      <div className="absolute top-full right-0 mt-2 glass-strong rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[120px] z-50">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLanguage(loc)}
            className={cn(
              'w-full text-right px-3 py-2 rounded text-sm transition-colors',
              locale === loc
                ? 'bg-purple-600/30 text-purple-400'
                : 'text-gray-300 hover:text-white hover:bg-purple-600/10'
            )}
          >
            {languageNames[loc]}
          </button>
        ))}
      </div>
    </div>
  );
}