'use client';

import { usePathname, useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { getAdminToken } from '@/lib/adminAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'de';
  const isLoginPage = pathname?.endsWith('/admin/login') ?? false;

  useEffect(() => {
    const token = getAdminToken();
    if (isLoginPage) {
      if (token) router.replace(`/${locale}/admin`);
      return;
    }
    if (!token) {
      router.replace(`/${locale}/admin/login`);
    }
  }, [isLoginPage, locale, router]);

  return <>{children}</>;
}
