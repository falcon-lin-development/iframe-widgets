'use client';
import {
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
} from 'next-share';
import {
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Box,
  Snackbar,
} from '@mui/material';
import { X, MoreHorizontal, LucideCopyPlus, Copy } from 'lucide-react';
import colors from '@/styles/colors.config';
import React, { useMemo } from 'react';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { log } from 'console';
import { ButtonID } from '@/constants';

const SocialShareSection: React.FC<{
  title: string;
  url: string;
  iconSize: number;
  shareAction: string;
  copyAction: string;
  sx?: React.CSSProperties;
}> = ({
  title,
  url,
  // iconSize,
  shareAction,
  copyAction,
  sx = {},
}) => {
  const iconSize = 40;
  const [open, setOpen] = React.useState(false);
  const { logButtonClick } = useLogEvent();
  const referralCode = useMemo(() => {
    try {
      const _url = new URL(url);
      const params = new URLSearchParams(_url.search);
      const referralCode = params.get('referralcode');
      return referralCode ? referralCode : null;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  }, [url]);

  const share = () => {
    logButtonClick(shareAction, 'channel=other', '', {
      referral_code: referralCode,
    });
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: title,
          url: url + '&channel=other',
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    }
  };
  const copyToClipboard = () => {
    logButtonClick(copyAction, 'channel=other', '', {
      referral_code: referralCode,
    });

    navigator.clipboard
      .writeText(url + '&channel=other')
      .then(() => console.log('Successful copy'))
      .catch((error) => console.log('Error copying:', error));

    setOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          padding: '12px',
          bgcolor: colors.primarySwatch.main[98],
          ...sx,
        }}
      >
        <WhatsappShareButton
          url={url + '&channel=whatsapp'}
          title={title}
          separator="-> "
          onClick={() =>
            logButtonClick(shareAction, 'channel=whatsapp', '', {
              referral_code: referralCode,
            })
          }
        >
          <WhatsappIcon size={iconSize} round />
        </WhatsappShareButton>
        {/* <EmailShareButton
                    url={url + "&channel=email"}
                    subject={title}
                    body={title + ' ' + url}
                >
                    <EmailIcon size={32} round />
                </EmailShareButton> */}
        <TelegramShareButton
          url={url + '&channel=telegram'}
          title={title}
          onClick={() =>
            logButtonClick(shareAction, 'channel=telegram', '', {
              referral_code: referralCode,
            })
          }
        >
          <TelegramIcon size={iconSize} round />
        </TelegramShareButton>
        <TwitterShareButton
          url={url + '&channel=twitter'}
          title={title}
          onClick={() =>
            logButtonClick(shareAction, 'channel=twitter', '', {
              referral_code: referralCode,
            })
          }
        >
          <TwitterIcon size={iconSize} round />
        </TwitterShareButton>
        <FacebookShareButton
          url={url + '&channel=facebook'}
          quote={title}
          hashtag={'#mootiez'}
          onClick={() =>
            logButtonClick(shareAction, 'channel=facebook', '', {
              referral_code: referralCode,
            })
          }
        >
          <FacebookIcon size={iconSize} round />
        </FacebookShareButton>
        {navigator.share === undefined ? (
          <IconButton
            sx={{
              border: '1px solid !important',
              color: colors.neutralSwatch.main[10],
              '&:hover': {
                border: '1px solid',
              },
            }}
            onClick={copyToClipboard}
          >
            <Copy size={21} />
          </IconButton>
        ) : (
          <IconButton
            sx={{
              color: colors.neutralSwatch.main[10],
              border: '1px solid',
              '&:hover': {
                border: '1px solid',
              },
            }}
            onClick={share}
          >
            <MoreHorizontal size={24} />
          </IconButton>
        )}
      </Box>

      <Snackbar
        open={open}
        sx={{}}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message="Copied to clipboard"
        // action={action}
      />
    </>
  );
};

export default SocialShareSection;
