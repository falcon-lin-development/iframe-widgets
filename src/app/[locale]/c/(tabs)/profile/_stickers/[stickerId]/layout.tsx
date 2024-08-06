import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mootiez Stickers Detail',
  description: 'Mootiez Stickers Detail Page',
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
