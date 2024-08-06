import React from 'react';
import { NextPage } from 'next';

import routes from '@/routes/routes';

import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';

import Image from 'next/image';

// constants
import assets from '@/constants';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import Link from 'next/link';
import Layout from '@/app/layout';
import colors from '@/styles/colors.config';

const Page: NextPage = () => {
  return (
    <Scaffold
      appbar={<AppBar backButton={<BackIconButton />} />}
      mainBody={
        <MainBody className="tw-text-black tw-rounded-lg tw-justify-center tw-items-center tw-px-[1rem]">
          <Image
            src={assets.images.app.image404}
            alt="404"
            width={254}
            height={233}
            style={{
              width: 254,
              height: 233,
              // flex-shrink: 0;
            }}
          />
          <div className="tw-pt-[24px]" aria-label="spacer"></div>
          <div className="title-large tw-text-neutralSwatch-10 tw-text-center">
            Oops! Something Went Wrong...
          </div>
          <div className="tw-pt-[8px]" aria-label="spacer"></div>
          <div className="body-large tw-text-neutralSwatch-30 tw-text-center">
            But don’t worry, everything is still cool!
          </div>
          <div className="tw-pt-[24px]" aria-label="spacer"></div>
          <div
            className="tw-w-full tw-text-center"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: colors.primarySwatch.main[40], // Sets the background color for the contained button
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '2.5rem',
                borderRadius: '999rem',
                width: '16rem',
              }}
            >
              <Link
                href={routes.c._home}
                style={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '1.25rem',
                  letterSpacing: '0.1px',
                  padding: '10px 0px',
                  color: 'white', // Sets the text color for the contained button
                }}
              >
                Back to Homepage
              </Link>
            </div>
          </div>
          <div className="tw-pt-[24px]" aria-label="spacer"></div>
        </MainBody>
      }
    />
  );
};

export default Page;
