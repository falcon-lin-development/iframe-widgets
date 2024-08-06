'use client';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const Logger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logMBTIPageView } = useLogEvent();
  const pathname = usePathname();

  useEffect(() => {
    logMBTIPageView(pathname);
  }, []);

  return <>{children}</>;
};

export default Logger;
