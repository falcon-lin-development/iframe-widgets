'use client';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { MBTITestPage } from '@/app/[locale]/c/(flows)/flow/onboarding/1.mbti';
import { useRouter } from 'next/navigation';
import { useCenterFixedPosition } from '@/utils/usePosition';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Snackbar, Typography } from '@mui/material';
import { isMobile } from 'react-device-detect';
import { usePersonaAttributeBadges } from '@/data/graphql/hooks/usePersonaAttributeBadges';
import { useMutationDropUserAttribute } from '@/data/graphql/hooks/useMutationDropUserAttribute';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

const _MBTITestPage: NextPage = () => {
  const [ei, setei] = React.useState<'E' | 'I' | null>(null);
  const [sn, setsn] = React.useState<'S' | 'N' | null>(null);
  const [tf, settf] = React.useState<'T' | 'F' | null>(null);
  const [jp, setjp] = React.useState<'J' | 'P' | null>(null);
  const router = useRouter();
  const { left } = useCenterFixedPosition();
  const [errorMessage, setErrorMessage] = React.useState('');
  const validateStep = () => {
    if (!ei || !sn || !tf || !jp) {
      setErrorMessage('MBTI is required');
      return false;
    }
    return true;
  };
  const [successMessage, setSuccessMessage] = React.useState('');

  // hook data
  const {
    state: { userAttributesInit, userAttributes, userAttributesState },
  } = usePersonaAttributeBadges();
  const {
    state: { dropUserAttributeState },
    actions: { dropUserAttribute },
  } = useMutationDropUserAttribute();
  // check
  const _alreadyHasMBTI = Boolean(
    userAttributes.find((attr) => attr.pointId.includes('mbti')),
  );

  const _submitAndDropAttributes = async () => {
    // only drop the attriute to user
    dropUserAttribute({
      categoryType: 'mbti',
      categoryValue: `${ei}${sn}${tf}${jp}`
        .toLocaleLowerCase()
        .replaceAll(':', '_')
        .replaceAll('/', '_'),
    }).then((res) => {
      if (res.data?.giveawayCommunityBadge?.__typename === 'GraphqlError') {
        setErrorMessage(res.data.giveawayCommunityBadge.message);
      } else {
        setSuccessMessage('MBTI collected successfully');
      }
    });
  };

  if (!userAttributesInit) {
    return <LoadingPage />;
  }

  return (
    <>
      <MBTITestPage
        ei={ei}
        sn={sn}
        tf={tf}
        jp={jp}
        setei={setei}
        setsn={setsn}
        settf={settf}
        setjp={setjp}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        onBackClick={() => router.back()}
      />

      {/* Floating Button */}
      <Box // bot mid floating button
        sx={{
          position: 'fixed',
          bottom: '16px',
          left: `${left}px`,
          transform: isMobile ? 'translateX(-50%)' : 'translateX(-52%)',
        }}
      >
        <LoadingButton
          variant="contained"
          onClick={() => {
            setErrorMessage('');
            if (validateStep()) {
              _submitAndDropAttributes();
            }
          }}
          sx={{
            paddingX: '24px',
            // width: '272px',
          }}
          disabled={
            !Boolean(ei && sn && tf && jp) ||
            _alreadyHasMBTI ||
            dropUserAttributeState.fetching ||
            Boolean(successMessage)
          }
          loading={dropUserAttributeState.fetching}
        >
          <Typography variant="labelLarge">
            {_alreadyHasMBTI ? 'Collected' : 'Collect'}
          </Typography>
        </LoadingButton>
      </Box>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={() => {
          setSuccessMessage('');
          router.back();
        }}
        message={successMessage}
        action={
          <>
            <Button
              onClick={() => {
                setSuccessMessage('');
                router.back();
              }}
            >
              <Typography>Go Back</Typography>
            </Button>
          </>
        }
      />
    </>
  );
};

export default _MBTITestPage;
