'use client';
import { NextPage } from 'next';

// components
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import InboxScaffold from './components/InboxScaffold.client';

const Page: NextPage = () => {
  // const { community, communityPathId } = useCommunity();
  // const { communityProfile } = useCommunityProfile(community);
  // const { communityInboxs } = useCommunityInboxs(community);

  return (
    <>
      <InboxScaffold
        appbar={
          <AppBar backButton={<BackIconButton />} title="Notifications" />
        }
      />
    </>
  );
};

export default Page;
