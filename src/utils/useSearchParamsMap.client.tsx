'use client';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

const useSearchParamsMap = () => {
  const params = useSearchParams();

  const searchParamsMap = useMemo(() => {
    const map: Record<string, string> = {};
    params.forEach((value, key) => {
      map[key] = value;
    });
    return map;
  }, [params]);

  return {
    searchParams: params,
    searchParamsMap,
  };
};

export default useSearchParamsMap;
