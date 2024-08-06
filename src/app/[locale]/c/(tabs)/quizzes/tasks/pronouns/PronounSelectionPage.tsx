'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { PronounSeclectionPage } from '@/app/[locale]/c/(flows)/flow/onboarding/2.pronouns';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

import { Box, Button, Snackbar, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// hooks
import { useCenterFixedPosition } from '@/utils/usePosition';
import { isMobile } from 'react-device-detect';
import { usePersonaAttributeBadges } from '@/data/graphql/hooks/usePersonaAttributeBadges';
import { useMutationDropUserAttribute } from '@/data/graphql/hooks/useMutationDropUserAttribute';
import useCommunity from '@/hooks/useCommunity';

const _PronounSelectionPage: React.FC = () => {
  const router = useRouter();
  const { left } = useCenterFixedPosition();
  const [selectedPronouns, setSelectedPronouns] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const validateStep = () => {
    if (!selectedPronouns) {
      setErrorMessage('Pronouns is required');
      return false;
    }
    return true;
  };
  const [successMessage, setSuccessMessage] = React.useState('');

  // hooks data
  const { community } = useCommunity();
  const {
    state: { userAttributesInit, userAttributes, userAttributesState },
  } = usePersonaAttributeBadges();
  // const {actions: {updateProfile}} = useMutationUserProfile(community);
  const {
    state: { dropUserAttributeState },
    actions: { dropUserAttribute },
  } = useMutationDropUserAttribute();

  // check
  const _alreadyHasPronouns = Boolean(
    userAttributes.find((attr) => attr.pointId.includes('pronoun')),
  );

  const _submitAndDropAttributes = async () => {
    // only drop the attriute to user
    dropUserAttribute({
      categoryType: 'pronoun',
      categoryValue: selectedPronouns
        .toLocaleLowerCase()
        .replaceAll(':', '_')
        .replaceAll('/', '_'),
    }).then((res) => {
      if (res.data?.giveawayCommunityBadge?.__typename === 'GraphqlError') {
        setErrorMessage(res.data.giveawayCommunityBadge.message);
      } else {
        setSuccessMessage('Pronouns collected successfully');
      }
    });
  };

  if (!userAttributesInit) {
    return <LoadingPage />;
  }

  return (
    <>
      <PronounSeclectionPage
        selectedPronouns={selectedPronouns}
        onSelectPronouns={setSelectedPronouns}
        onBackClick={() => {
          router.back();
        }}
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
          loading={dropUserAttributeState.fetching}
          disabled={
            !Boolean(selectedPronouns) ||
            _alreadyHasPronouns ||
            dropUserAttributeState.fetching ||
            Boolean(successMessage)
          }
        >
          <Typography variant="labelLarge">
            {_alreadyHasPronouns ? 'Collected' : 'Collect'}
          </Typography>
        </LoadingButton>
      </Box>

      {/* snackbars */}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
        message={errorMessage}
      />
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

export default _PronounSelectionPage;
