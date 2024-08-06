import { useEffect, useMemo, useState } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import React from 'react';

const useScrollingData = () => {
  const { scrollY } = useScroll();
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const PickerMaxHeightFactor = 0.8; // == 80vh
  const PickerMinHeightFactor = 0.35; // == 35vh
  const _transformScaleY = useTransform(
    scrollY,
    [
      0,
      viewportHeight *
        PickerMaxHeightFactor * // height of the picker
        (1 - PickerMinHeightFactor),
    ], // distance from max to min height
    [1, PickerMinHeightFactor], // transform to scale factor
  );
  const [scaleY, setScaleY] = React.useState(1);

  // Update viewport height on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    const unsubscribeScaleY = _transformScaleY.on('change', (value) => {
      setScaleY(value);
    });

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribeScaleY();
    };
  }, []);

  return {
    state: {
      scaleY,
      minScaleY: PickerMinHeightFactor,
      pickerHeight: viewportHeight * PickerMaxHeightFactor,
    },
  };
};

export default useScrollingData;

export type useOpacityProps = {
  scaleY: number;
  orientationCriteria: number;
  minScaleY: number;
};
export const useOpacity = ({
  scaleY,
  orientationCriteria,
  minScaleY,
}: useOpacityProps) => {
  const _opacity = useMemo(() => {
    let opacity;
    const _maxNonOpacityScale = Math.max(minScaleY, orientationCriteria);
    const _minFullOpacityScale = 0.8;
    if (scaleY < _maxNonOpacityScale) {
      opacity = 1;
    } else if (scaleY >= _minFullOpacityScale) {
      opacity = 0;
    } else {
      opacity =
        1 -
        (scaleY - _maxNonOpacityScale) /
          (_minFullOpacityScale - _maxNonOpacityScale);
    }
    return opacity;
  }, [scaleY]);
  return { opacity: _opacity };
};
