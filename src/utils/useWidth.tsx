'use client';

import React, { useEffect } from 'react';
import { useMemo } from 'react';

export const useWidth = ({ maxWidth = 430 }: { maxWidth?: number | null }) => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  useEffect(() => {
    // set the window innerWidth to windowWidth, width listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  //   const v = useMemo(() => {
  //     // UI max width is 430
  //     const _v = left || right;
  //     if (windowWidth > maxWidth) {
  //       // get the window innerWidth, if innerWidth is greater than 430,
  //       // add (window.innerWidth - 430) // 2 to the v
  //       return _v! + (windowWidth - maxWidth) / 2;
  //     } else {
  //       // otherwise, if innerWidth is less than 430,
  //       return _v!;
  //       // return _v! - (maxWidth - windowWidth) / 2;
  //     }
  //   }, [windowWidth]);

  return {
    windowWidth: maxWidth ? Math.min(windowWidth, maxWidth) : windowWidth,
    windowWidthFull: windowWidth,
  };
};
