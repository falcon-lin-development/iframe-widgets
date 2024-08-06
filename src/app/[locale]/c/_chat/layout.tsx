import { Metadata } from 'next';
import Logger from '@/components/common/Logger.client';
import { EventName } from '@/data/services/LogService';

export const metadata: Metadata = {
  title: 'Mootiez ChatRooms',
  description: 'Mootiez ChatRooms Page',
};

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Logger eventName={EventName.chat_page_view}>{children}</Logger>
    </>
  );
}
