import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { Vazirmatn } from 'next/font/google';
import '../globals.css';
import { Providers } from '../providers';
import { FloatingNav } from '@/components/aceternity/floating-nav';

const vazir = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazir' });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'} suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
        {locale === 'fa' && <style>{`body { font-family: 'Jost', 'Roboto', sans-serif !important; }`}</style>}
      </head>
      <body className="bg-neutral-950 text-white antialiased selection:bg-cyan-500/30 overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="bg-noise pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"></div>
            {children}
            <FloatingNav />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}