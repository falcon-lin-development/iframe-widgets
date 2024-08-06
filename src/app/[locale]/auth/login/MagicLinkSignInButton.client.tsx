'use client';
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  setErrorMessage as _setErrorMessage,
  setSuccessMessage as _setSuccessMessage,
  setResendCountDown as _setResendCountDown,
  validateEmail,
} from '@/redux/features/authSlice';
import { CircularProgress, Typography } from '@mui/material';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import colors from '@/styles/colors.config';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import { ButtonID } from '@/constants';

// type MagicLinkSignInButtonProps = object & {};

interface Props {
  nexturl: string;
  loginurl?: string | undefined;
  btnText?: string;
  templateId: string;
}

export const useMagicLinkSignInState = ({
  nexturl,
  templateId,
}: {
  nexturl: string;
  templateId: string;
}) => {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.authSlice.value.login.email);
  const agreedToTerms = useAppSelector(
    (state) => state.authSlice.value.login.agreedToTerms,
  );
  const errorMessage = useAppSelector(
    (state) => state.authSlice.value.login.errorMessage,
  );
  const setErrorMessage = (value: string) => {
    dispatch(_setErrorMessage(value));
  };
  const successMessage = useAppSelector(
    (state) => state.authSlice.value.login.successMessage,
  );
  const setSuccessMessage = (value: string) => {
    dispatch(_setSuccessMessage(value));
  };
  const resendCountDown = useAppSelector(
    (state) => state.authSlice.value.login.resendCountDown,
  );
  const setResendCountDown = (value: number) => {
    dispatch(_setResendCountDown(value));
  };

  React.useEffect(() => {
    if (resendCountDown === 0) {
      // Handle time over (e.g., disable the button)
      // pass
    } else {
      const timer = setTimeout(() => {
        if (resendCountDown > 0) {
          setResendCountDown(resendCountDown - 1);
        } else {
          // do nothing
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountDown]);

  const [isLoading, setIsLoading] = useState(false);

  const { logButtonClick } = useLogEvent();
  const { navigate } = useAppRouting();
  const {
    utils: { dgSignInEmail },
  } = useDGAuth();

  const handleButtonClick = async ({
    goToWaiting = true,
  }: {
    goToWaiting?: boolean;
  }) => {
    logButtonClick(ButtonID.emailLogin, '');
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    try {
      setIsLoading(true);

      if (errorMessage) setErrorMessage(''); // reset error message
      if (successMessage) setSuccessMessage(''); // reset success message

      // const EMAIL_TEMPLATE_ID = 'gryfyn';
      const EMAIL_TEMPLATE_ID = templateId;
      console.log('EMAIL_TEMPLATE_ID:', EMAIL_TEMPLATE_ID);
      const trimmedEmail = email.trim();
      // Create a new URL object based on nexturl and the current location origin
      const url = new URL(nexturl, window.location.origin);

      // Append the 'entity' and 'language' parameters
      url.searchParams.append('entity', EMAIL_TEMPLATE_ID);
      url.searchParams.append('language', 'en');

      // The modified URL as a string
      const defaultRedirectUrl = url.toString();
      const result = await dgSignInEmail(
        EMAIL_TEMPLATE_ID,
        trimmedEmail,
        'en',
        defaultRedirectUrl,
      );
      console.log(result);
      setIsLoading(false);
      // const message = result?.message ?? '';
      const message =
        result?.statusCode === 200 ? `Magic Link Sent to ${trimmedEmail}` : '';
      if (message) {
        // setSuccessMessage(message);
        setSuccessMessage(
          'Authentication Email is sent to your email address. Please check your email and click the link to login.',
        );
        setResendCountDown(60);
        setTimeout(() => {
          setSuccessMessage('');
        }, 60000);

        if (goToWaiting) {
          navigate(routes.auth.magiclink.waiting, {
            defaultOptions: {},
            searchParams: {
              next: nexturl,
            },
          });
        }
      }

      if (result === false) {
        // custom error for DGAuthlib
        setErrorMessage('Magic Link already sent within 1 minute');
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      setErrorMessage(errorMessage);
    }
  };

  return {
    email,
    agreedToTerms,
    errorMessage,
    successMessage,
    resendCountDown,
    isLoading,
    handleButtonClick,
  };
};

const MagicLinkSignInButton: React.FC<Props> = ({
  nexturl,
  loginurl,
  btnText,
  templateId,
}) => {
  const {
    email,
    agreedToTerms,
    errorMessage,
    successMessage,
    resendCountDown,
    isLoading,
    handleButtonClick,
  } = useMagicLinkSignInState({
    nexturl,
    templateId,
  });

  let displayContent = <></>;
  if (isLoading) {
    displayContent = (
      <CircularProgress size={20} sx={{ color: colors.white }} />
    );
  } else if (resendCountDown > 0) {
    displayContent = <>Resend ({resendCountDown})</>;
  } else if (btnText) {
    displayContent = <>{btnText}</>;
  } else {
    displayContent = <>Continue</>;
  }

  return (
    <>
      <Button
        id={ButtonID.emailLogin}
        onClick={() => handleButtonClick({ goToWaiting: true })}
        fullWidth
        variant="contained"
        disabled={
          isLoading || !email.trim() || !agreedToTerms || resendCountDown > 0
        }
      >
        <Typography
          variant="labelLarge"
          sx={{
            transform: 'translateY(2px)',
          }}
        >
          {displayContent}
        </Typography>
      </Button>
    </>
  );
};

export default MagicLinkSignInButton;
