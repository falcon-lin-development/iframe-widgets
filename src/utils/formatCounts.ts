export const formatCounts = (count?: number): string => {
  // if count below 1000, return as is
  // if count above 1k, return as 1.xx k
  // if count above 1m, return as 1.xx m
  // and so on
  if (!count) return '0';

  const decimal = 2;
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return `${(count / 1000).toFixed(decimal)}k`;
  } else if (count < 1000000000) {
    return `${(count / 1000000).toFixed(decimal)}m`;
  } else if (count < 1000000000000) {
    return `${(count / 1000000000).toFixed(decimal)}b`;
  } else {
    return `${(count / 1000000000000).toFixed(decimal)}t`;
  }
};
