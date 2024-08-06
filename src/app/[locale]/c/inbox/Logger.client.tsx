'use client';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { EventName } from '@/data/services/LogService';

const Logger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logEvent } = useLogEvent();
  const pathname = usePathname();

  useEffect(() => {
    logEvent(EventName.inbox_page_view, {
      page: pathname,
    });
  }, []);

  return <>{children}</>;
};

export default Logger;
