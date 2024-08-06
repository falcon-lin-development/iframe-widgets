'use client';
// Next.js related
import { NextPage } from 'next';

// Components
import MootiezReportScaffold from '@/app/[locale]/mbti/mootiez-report/MootiezReportScaffold';
import MBTICard from './MBTICard';
// App routing and utilities
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import useMBTIReportData from '@/hooks/useMBTIReporData';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import assets from '@/constants';
import LoadingPage from '@/components/loadingComponents/LoadingPageTransition';

const Page: NextPage = () => {
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const { init, reportJson, fullReportJson, mbtiType, cachedMBTIData } =
    useMBTIReportData(communityProfile);

  if (
    !(
      cachedMBTIData &&
      reportJson &&
      fullReportJson &&
      communityProfile.community_id
    )
  ) {
    return <LoadingPage />;
  }
  return (
    <MBTICard
      mbti={cachedMBTIData}
      profileUrl={
        communityProfile.profile_avatar_url || assets.images.app.defaultAvatar
      }
      report={reportJson}
      fullReport={fullReportJson}
      profile={communityProfile}
    />
  );

  // return (
  //   <>
  //     <MootiezReportScaffold
  //       stickyAppBar={
  //         <AppBar backButton={<BackIconButton />} title="Personality Report" />
  //       }
  //       showEnterCommunityButton={false}
  //     />
  //   </>
  // );
};

export default Page;
