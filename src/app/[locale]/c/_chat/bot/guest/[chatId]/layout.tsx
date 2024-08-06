import { Metadata } from 'next';
import ChatRoomContextProvider from './ChatRoomContextProvider';

export const metadata: Metadata = {
  title: 'Mootiez ChatRoom',
  description: 'Mootiez ChatRoom Page',
};

type LayoutProps = {
  params: { locale: string; chatId: string };
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};
const Layout: React.FC<LayoutProps> = ({
  children,
  params: { chatId },
}: LayoutProps) => {
  console.log(chatId);
  return (
    <>
      <ChatRoomContextProvider roomId={chatId}>
        {children}
      </ChatRoomContextProvider>
    </>
  );
};

export default Layout;
