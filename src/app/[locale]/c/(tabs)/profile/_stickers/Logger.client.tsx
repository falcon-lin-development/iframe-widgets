'use client';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { EventName } from '@/data/services/LogService';
import { useSearchParams } from 'next/navigation';
const Logger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logEvent } = useLogEvent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    logEvent(
      EventName.stickers_page_view,
      {
        page: pathname,
        searchParams: searchParams.toString(),
      },
      pathname,
    );
  }, []);

  return <>{children}</>;
};

export default Logger;
