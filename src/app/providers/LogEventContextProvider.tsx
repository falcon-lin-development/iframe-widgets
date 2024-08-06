'use client';
import React, { createContext, useContext, useMemo } from 'react';

// service
import {
  EventName,
  logEvent as logEventAPICall,
  ProfileEventName,
  logProfileEvent as logProfileEventAPICall,
} from '@/data/services/LogService';
import {
  setSessionId,
  setUtmData,
} from '@/redux/features/tracking/sessionSlice';

// hooks
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuthRouterStates } from './AuthRouterStatesContextProvider';
import { useDGAuth } from '@dttd-io/dg-auth-lib';

type LogEventContextType = ReturnType<typeof _useEventLogs>;

const LogEventContext = createContext<LogEventContextType | null>(null);

const _useEventLogs = () => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.sessionSlice.value);
  // not best but do-able
  const {
    state: { pathname, searchParams, isAuthenticated },
  } = useAuthRouterStates();

  const {
    utils: { getBearerToken },
  } = useDGAuth();

  const uniqueId = useMemo(async () => {
    if (isAuthenticated) {
      return (await getBearerToken()).email;
    } else {
      return '-';
    }
  }, [isAuthenticated]);

  const logEvent = async (
    event_name: EventName,
    event_data: Record<string, any>,
    session_id?: string,
  ) => {
    logEventAPICall({
      app_id: `mootiez-dapp-${process.env.ENV}`,
      event_name: event_name,
      event_data: event_data,
      unique_id: (await uniqueId) || '-',
      session_id: session.sessionId || session_id || '-',
      session_data: session.utmData,
    });
    if (typeof window !== 'undefined' && window.gtag) {
      if (event_name !== EventName.page_view) {
        console.log('gtag', event_name);
        window.gtag('event', event_name, {
          app_id: `mootiez-dapp-${process.env.ENV}`,
          event_name: event_name,
          event_data: event_data,
          unique_id: (await uniqueId) || '-',
          session_id: session.sessionId || session_id || '-',
          session_data: session.utmData,
        });
      }
    }
  };

  const logPageView = async (page_name: string) => {
    logEvent(EventName.page_view, {
      page: page_name,
      searchParams: searchParams.toString(),
    });
  };

  const logButtonClick = async (
    btn_name: string,
    target: string,
    page?: string,
    data: Record<string, any> = {},
  ) => {
    logEvent(EventName.btn_click, {
      action: btn_name,
      target: target,
      page: page || pathname,
      searchParams: searchParams.toString(),
      ...data,
    });
  };

  /**
   * historical events
   */
  // const logProfilePageView = async (page_url: string) => {
  //   logEvent(EventName.profile_page_view, {
  //     page: page_url,
  //   });
  // };

  const logMBTIPageView = async (page_url: string) => {
    logEvent(EventName.mbti_page_view, {
      page: page_url,
    });
  };

  /**
   * Create session id if none
   */
  useEffect(() => {
    if (!session.sessionId) {
      const sessionId = uuidv4();
      logEvent(
        EventName.app_session_start,
        { session_id: sessionId },
        sessionId,
      );
      dispatch(setSessionId(sessionId));
    }
  }, [session]);

  useEffect(() => {
    if (searchParams.size > 0) {
      const utmData = Array.from(searchParams.entries()).reduce<
        Record<string, string>
      >((acc, [key, value]) => {
        if (key.startsWith('utm_') && /[a-zA-Z0-9]/.test(value)) {
          acc[key] = value;
        }
        // this is for pf analytics
        if (key.startsWith('pf_') && /[a-zA-Z0-9]/.test(value)) {
          acc[key] = value;
        }
        return acc;
      }, {});

      dispatch(
        setUtmData({
          ...session.utmData,
          ...utmData,
        }),
      );
    }
  }, [searchParams]);

  /**
   * Log Page View
   */
  useEffect(() => {
    logPageView(pathname);
  }, [pathname]);

  return {
    sessionId: session.sessionId || '-',
    utmData: session.utmData,
    logEvent,
    logPageView,
    logButtonClick,
    // logProfilePageView,
    logMBTIPageView,
  };
};

export default function LogEventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LogEventContext.Provider value={_useEventLogs()}>
      {children}
    </LogEventContext.Provider>
  );
}

export function useLogEvent() {
  const context = useContext(LogEventContext);
  if (!context) {
    throw new Error('useLogEvent must be used within a LogEventProvider');
  }
  return context;
}
