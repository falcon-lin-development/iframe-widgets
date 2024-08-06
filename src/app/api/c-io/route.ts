import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface CustomerIOFormData {
  [key: string]: any;
}

const _getKeys = async () => {
  const customerIOSite = process.env.CUSTOMER_IO_SITE_ID;
  const customerIOApiKey = process.env.CUSTOMER_IO_API_KEY;
  const formId =
    process.env.ENV === 'prod' ? 'prodSurveyMBTIQuiz' : 'devSurveyMBTIQuiz';

  if (!customerIOSite) {
    console.error(`Error in postCustomerIOForm: customerIOSite is not defined`);
    // throw new Error('customerIOSite is not defined');
  } else if (!customerIOApiKey) {
    console.error(
      `Error in postCustomerIOForm: customerIOApiKey is not defined.`,
    );
    // throw new Error('customerIOApiKey is not defined');
  }

  return [customerIOSite, customerIOApiKey, formId];
};

export async function GET(request: NextRequest) {
  const [customerIOSite, customerIOApiKey, formId] = await _getKeys();

  if (process.env.ENV === 'prod') {
    return NextResponse.redirect('https://www.google.com');
  }

  return NextResponse.json({
    message: 'Hello World!',
    customerIOSite: customerIOSite,
    customerIOApiKey: customerIOApiKey,
    formId: formId,
    env: process.env.ENV,
  });
}

export async function POST(request: NextRequest) {
  const [customerIOSite, customerIOApiKey, formId] = await _getKeys();

  if (process.env.ENV === 'prod') {
    return NextResponse.redirect('https://www.google.com');
  }

  return NextResponse.json({
    message: 'Hello World!',
    customerIOSite: customerIOSite,
    customerIOApiKey: customerIOApiKey,
    formId: formId,
    env: process.env.ENV,
  });
}
