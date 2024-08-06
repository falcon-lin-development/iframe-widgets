'use client';

// Components

import { Box } from '@mui/material';
import DividerWithText from '@/components/DividerWithText';
import SocialShareSection from './SocialShareSection';

// constants
import colors from '@/styles/colors.config';
import Image from 'next/image';
import assets, { ButtonID } from '@/constants';
const InviteDelusionIndexSurveySection: React.FC<{ referral_code: string }> = ({
  referral_code,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        padding: '24px 12px',
        bgcolor: colors.primarySwatch.main[98],
      }}
    >
      <div className="title-large tw-text-primarySwatch-40 tw-text-center">
        see what friends think about you
      </div>
      <br />

      <div className="tw-pt-[1vh]" aria-label="spacer" />
      <div className="body-large tw-text-neutralSwatch-30 tw-text-center">
        this is how you view yourself. But are you different to other people?
      </div>
      <br />
      <div className="body-large tw-text-neutralSwatch-30 tw-text-center">
        it can be enriching to ask your friends to complete a review of how you
        are like with them.
      </div>
      <br />
      <div className="body-large tw-text-neutralSwatch-30 tw-text-center">
        send this link to your friends, and get your delusion index report!
      </div>
      <DividerWithText text="Step 1" />
      <div className="body-medium tw-text-neutralSwatch-30 tw-text-center">
        invite your friends to take the MBTI test for you
      </div>
      <div className="tw-pt-[1vh]" aria-label="spacer" />
      <SocialShareSection
        title={
          'Hey! \n\nCan you help me take this MBTI test as if you were me? It will help me check how delusional I am 😂'
        }
        url={`${process.env.SHARE_MY_TEST_TO_FRD_URL || 'https://mootiez.com/'}?referralcode=${referral_code}`}
        iconSize={32}
        shareAction={ButtonID.social_share.share_di}
        copyAction={ButtonID.social_share.copy_to_clipboard_di}
      />
      <DividerWithText text="Step 2" />
      <div className="body-medium tw-text-neutralSwatch-30 tw-text-center">
        once they finish the test, the delusion index report will be sent to
        your inbox. Access your portal by logging in.
      </div>
      <div className="tw-pt-[1vh]" aria-label="spacer" />
      <Image
        src={assets.mbti.dIReportPreview}
        alt="Delusion Index Survey"
        width={2540}
        height={2900}
        style={{
          width: '254px',
          height: '290px',
        }}
      />
    </Box>
  );
};

export default InviteDelusionIndexSurveySection;
