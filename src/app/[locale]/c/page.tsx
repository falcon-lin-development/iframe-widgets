'use client';
import { NextPage } from 'next';
import QuestPage from './(tabs)/journeys/page';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { EventName } from '@/data/services/LogService';

type Props = {
  params: {
    locale: string;
  };
};

const Page: NextPage<Props> = ({ params }) => {
  const { logEvent } = useLogEvent();
  const pathname = usePathname();

  useEffect(() => {
    logEvent(EventName.quest_page_view, {
      page: pathname,
    });
  }, []);

  return <QuestPage />;
};

export default Page;
