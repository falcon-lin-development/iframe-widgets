'use client';
import { NextPage } from 'next';
import { useEffect } from 'react';

// components
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import { ProfileDesignPanel } from './components/profileDesignPanel/ProfileDesignPanel';

// constants
import colors from '@/styles/colors.config';

// hooks
import { ProfileDesignpanelContextProvider } from './contextProvider/ProfileDesignpanelContextProvider';
import { useInitCommunityProfilePage } from '@/data/graphql/hooks/profileGridViewCustomisation/useInitCommunityProfilePage';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

const _useInitPageCustomization = () => {
  const {
    state: { isCommunityProfilePageInit },
  } = useInitCommunityProfilePage();

  useEffect(() => {}, []);

  return {
    isCommunityProfilePageInit,
  };
};

const Page: NextPage = () => {
  const { isCommunityProfilePageInit } = _useInitPageCustomization();

  if (!isCommunityProfilePageInit) {
    return <LoadingPage loadingText="Loading Page Customization..." />;
  }

  return (
    <>
      <EditorPanel />
    </>
  );
};

const EditorPanel: NextPage = () => {
  return (
    <Scaffold
      // appbar={
      //   <AppBar
      //     title="Page Customization"
      //     sx={{
      //       backgroundColor: colors.primarySwatch.main[90],
      //     }}
      //     backButton={
      //       <BackIconButton />
      //     }
      //   />
      // }
      mainBody={
        <MainBody
          sx={{
            backgroundColor: colors.primarySwatch.main[90],
          }}
          bottomPadding={false}
        >
          {/* <ToolboxLayout /> */}
          {/* <DragFromOutsideLayout /> */}
          <ProfileDesignpanelContextProvider>
            <ProfileDesignPanel />
          </ProfileDesignpanelContextProvider>
        </MainBody>
      }
    />
  );
};

export default Page;
