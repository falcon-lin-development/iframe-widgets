'use client';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import useMBTIData from '@/hooks/useMBTIData';
import assets from '@/constants';
// App routing and utilities
import { useAuthRouterStates } from '@/app/providers/AuthRouterStatesContextProvider';

// constants
import {
  MBTIData,
  getGender,
  getType,
  isMBTIDataValid,
} from '@/redux/features/mbti/mbtiSlice';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';

const useMBTIReportData = (communityProfile: CommunityProfile) => {
  const [init, setInit] = useState(false);
  const { mbtiData } = useMBTIData();
  const [reportJson, setReportJson] = useState({} as Record<string, any>);
  const [fullReportJson, setFullReportJson] = useState(
    {} as Record<string, any>,
  );
  const {
    state: { isAuthenticated, isJoinedCommunity },
  } = useAuthRouterStates();

  const cachedMBTIData = useMemo(() => {
    const remoteMBTI = (communityProfile.user_stored_data as { mbti: MBTIData })
      ?.mbti;
    const _mbtiData = isMBTIDataValid(remoteMBTI) ? remoteMBTI : mbtiData;
    if (!_mbtiData) return null;
    return _mbtiData;
  }, [
    mbtiData,
    (communityProfile.user_stored_data as { mbti: MBTIData })?.mbti,
  ]);

  const mbtiType: string | null = useMemo(() => {
    if (cachedMBTIData && isMBTIDataValid(cachedMBTIData)) {
      return getType(cachedMBTIData);
    } else {
      return null;
    }
  }, [
    mbtiData,
    (communityProfile.user_stored_data as { mbti: MBTIData })?.mbti,
  ]);

  const mbtiGender: string | null = useMemo(() => {
    let _mbtiGender = null;
    if (cachedMBTIData && isMBTIDataValid(cachedMBTIData)) {
      _mbtiGender = getGender(cachedMBTIData);
    }
    if (!_mbtiGender) return null;
    if (_mbtiGender === 'f') return 'Girl';
    if (_mbtiGender === 'm') return 'Boy';
    return _mbtiGender;
  }, [
    mbtiData,
    (communityProfile.user_stored_data as { mbti: MBTIData })?.mbti,
  ]);

  useEffect(() => {
    if (isAuthenticated && isJoinedCommunity) {
      if (mbtiType) {
        axios
          .get(
            assets.mbti.report[
              mbtiType.toUpperCase() as keyof typeof assets.mbti.report
            ],
          )
          .then((res) => {
            setReportJson(res.data);
          });
        axios
          .get(
            assets.mbti.fullReport[
              mbtiType.toUpperCase() as keyof typeof assets.mbti.fullReport
            ],
          )
          .then((res) => {
            setFullReportJson(res.data);
          });
      }
      setInit(true);
    }
  }, [isAuthenticated, isJoinedCommunity, mbtiType]);

  return {
    init,
    reportJson,
    fullReportJson,
    mbtiType,
    mbtiGender,
    cachedMBTIData,
  };
};

export default useMBTIReportData;
