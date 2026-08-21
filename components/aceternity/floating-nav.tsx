'use client';

import React from 'react';
import { FloatingDock } from '@/components/ui/floating-dock';
import { Home, Image as ImageIcon, UploadCloud, User, Phone, Settings, FileText } from 'lucide-react';

export function FloatingNav() {
  const links = [
    {
      title: 'Home',
      icon: (
        <Home className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '/',
    },
    {
      title: 'Archive',
      icon: (
        <ImageIcon className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '/archive',
    },
    {
      title: 'Invoice',
      icon: (
        <FileText className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '/invoice',
    },
    {
      title: 'About',
      icon: (
        <User className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '/about',
    },
    {
      title: 'Contact',
      icon: (
        <Phone className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '/contact',
    },
    {
      title: 'Admin',
      icon: (
        <Settings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: '/admin',
    },
    {
      title: 'Pinterest',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full text-neutral-500 dark:text-neutral-300"
        >
          <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0 -8 0" />
          <path d="M10.7 20c-.4 -2.2 .3 -4.7 1.3 -6.7" />
          <path d="M12 21a9 9 0 0 1 -9 -9c0 -4.97 4.03 -9 9 -9s9 4.03 9 9c0 3.86 -2.43 7.17 -5.92 8.48" />
        </svg>
      ),
      href: 'https://www.pinterest.com/mohammadramhorm/',
    },
  ];

  return (
    <div className="flex items-center justify-center fixed bottom-8 inset-x-0 z-50">
      <FloatingDock items={links} />
    </div>
  );
}