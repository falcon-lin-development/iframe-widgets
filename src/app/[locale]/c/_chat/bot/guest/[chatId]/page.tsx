'use client';
import { NextPage } from 'next';

// Skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';

// GraphQL
import Room from '../../../components/Room.client';

type PageProps = {
  params: {
    locale: string;
    chatId: string;
  };
  // searchParams: { [key: string]: string | string[] | undefined }
};

const Page: NextPage<PageProps> = ({
  params: { locale, chatId },
  // searchParams
}) => {
  // console.log(searchParams);
  // console.log(chatId);
  return (
    <>
      <Room />
    </>
  );
};

export default Page;
