'use client';

import { useUser } from '@/apis/user/user';
import { usePathname, useRouter } from 'next/navigation';
import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const AuthGuard: FC<Props> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname().replace('/', '');

  const { user, loading } = useUser();

  if (loading) return null;

  if (!user) {
    router.replace(`/auth/login?redirect=${pathname}`);
    return null;
  }

  return children;
};

export default AuthGuard;
