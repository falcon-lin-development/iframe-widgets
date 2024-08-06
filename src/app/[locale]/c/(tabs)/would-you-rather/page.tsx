'use client';
import React, { useMemo, useState } from 'react';
import { NextPage } from 'next';

// Skeletons
import TabSection, { TabPanel } from '@/components/TabSection';
import PopularTab from './(pageTabs)/PopularTab.client';
import RandomTab from './(pageTabs)/RandomTab';
import HistoryTab from './(pageTabs)/_HistoryTab';
import YoursTab from './(pageTabs)/YoursTab.client';

// hooks
import PageContextProvider, { usePageState } from './pageStateContextProvider';

const Page: NextPage = () => {
  // const param = useSearchParams();

  return (
    <PageContextProvider>
      <PageComponent />
    </PageContextProvider>
  );
};

const PageComponent: React.FC = () => {
  const {
    state: { tabId },
    actions: { setTabId },
  } = usePageState();

  return (
    <>
      <TabPanel index={0} value={tabId} tabSectionType="top-nav">
        <PopularTab />
      </TabPanel>
      <TabPanel index={1} value={tabId} tabSectionType="top-nav">
        <RandomTab />
      </TabPanel>
      {/* <TabPanel index={2} value={tabId} tabSectionType="top-nav">
        <HistoryTab />
      </TabPanel> */}
      <TabPanel index={2} value={tabId} tabSectionType="top-nav">
        <YoursTab />
      </TabPanel>
    </>
  );
};

export default Page;
