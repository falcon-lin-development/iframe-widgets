import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mootiez Stickers Create',
  description: 'Mootiez Stickers Create Page',
};

type LayoutProps = {
  params: { locale: string };
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};
export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <>{children}</>
    </>
  );
}
