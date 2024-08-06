import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // const { secret } = await import('@aws-amplify/backend');

  // Convert headers to a plain object
  const headers: Record<string, any> = {
    'cloudfront-viewer-country': request.headers.get(
      'cloudfront-viewer-country',
    ),
    'CloudFront-Viewer-Country': request.headers.get(
      'CloudFront-Viewer-Country',
    ),
  };
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Convert query params to a plain object
  const url = new URL(request.url);
  const query: Record<string, any> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });

  // Convert cookies to a plain object
  const cookies: Record<string, any> = {};
  request.cookies.getAll().forEach((cookie) => {
    cookies[cookie.name] = cookie.value;
  });

  // For body, we need to read it as text
  const body = await request.text();

  const logData = {
    headers,
    body,
    query,
    cookies,
  };

  // Log the data
  console.log(JSON.stringify(logData, null, 2));

  // Return the data
  return NextResponse.json({
    message: 'pong',
    ...logData,
    'cloudfront-viewer-country-after': request.headers.get(
      'cloudfront-viewer-country',
    ),
    'CloudFront-Viewer-Country-after': request.headers.get(
      'CloudFront-Viewer-Country',
    ),
  });
}
