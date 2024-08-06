export default function flattenRoutes(
  obj: any,
  pathList: string[] = [],
): string[] {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      pathList.push(obj[key]);
    } else if (typeof obj[key] === 'object') {
      flattenRoutes(obj[key], pathList);
    }
  }
  return pathList;
}
