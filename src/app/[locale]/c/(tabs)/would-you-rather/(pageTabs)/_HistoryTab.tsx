import { Box, Divider, Typography } from '@mui/material';

import TabSkeleton from '../components/TabSkeleton.client';
import { usePageState } from '../pageStateContextProvider';
import { WyrSummaryCard } from '../components/postCard/WyrSummaryCard.horizontal';
import { useMemo } from 'react';
import { isWyrPost } from '../graphql/models/WyrPost';

const HistoryTab: React.FC = () => {
  // 10 demo data, with different options, likes and timestamps
  // options should be any two things that can be compared
  // timestamp should be a which from 55 years ago to now, with ascending order
  const {
    state: { tabId, popularWyrState },
    actions: { setTabId },
  } = usePageState();

  const historyWYRs = useMemo(() => {
    if (popularWyrState.data) {
      return popularWyrState.data.getPopularWyrList.posts.filter((wyrPost) => {
        const _isValid = isWyrPost(wyrPost);
        if (!_isValid.isValid) {
          console.log(`HistoryTab: ${_isValid.error}`, wyrPost);
        }
        return _isValid.isValid;
      });
    } else {
      return [];
    }
  }, [popularWyrState]);

  return (
    <TabSkeleton value={tabId} setValue={setTabId}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 16px 16px 16px',
          width: '100%',
          gap: '16px',
        }}
      >
        {historyWYRs.map((wyr, index) => {
          return <WyrSummaryCard key={index} wyrPost={wyr} />;
        })}
      </Box>
    </TabSkeleton>
  );
};

export default HistoryTab;
