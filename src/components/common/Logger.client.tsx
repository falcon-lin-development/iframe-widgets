'use client';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { EventName } from '@/data/services/LogService';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const Logger: React.FC<{
  children: React.ReactNode;
  eventName: EventName;
}> = ({ children, eventName }) => {
  const { logEvent } = useLogEvent();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    logEvent(eventName, {
      pathname,
      searchParams: searchParams.toString(),
    });
  }, []);

  return <>{children}</>;
};

export default Logger;
