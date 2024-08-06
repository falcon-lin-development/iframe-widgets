import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  setMBTI,
  MBTIData,
  isMBTIDataValid,
} from '@/redux/features/mbti/mbtiSlice';
import {
  setIsGeneratedMootiez as _setIsGeneratedMootiez,
  // setIsGeneratingMootiez as _setIsGeneratingMootiez
} from '@/redux/features/mbti/isGeneratedMootiezSlice';

const useMBTIData = (searchParam?: object) => {
  const dispatch = useAppDispatch();
  const mbtiData: MBTIData = useAppSelector((state) => state.mbtiSlice.value);
  const isGeneratedMootiez: boolean = useAppSelector(
    (state) => state.isGeneratedMootiezSlice.value.isGeneratedMootiez,
  );
  const setIsGeneratedMootiez = (isGeneratedMootiez: boolean) => {
    dispatch(_setIsGeneratedMootiez(isGeneratedMootiez));
  };
  // const [isGeneratingMootiez, setIsGeneratingMootiez] = useState(false);

  useEffect(() => {
    // only overwrite if mbti is valid
    if (
      searchParam &&
      // && (!isMBTIDataValid(mbtiData))
      isMBTIDataValid(searchParam as MBTIData)
    ) {
      dispatch(setMBTI(searchParam));
    }
  }, [searchParam]);

  return {
    mbtiData,
    isGeneratedMootiez,
    setIsGeneratedMootiez,
    // isGeneratingMootiez,
    // setIsGeneratingMootiez
  };
};

export default useMBTIData;
