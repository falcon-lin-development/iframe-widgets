'use client';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import colors from '@/styles/colors.config';
import { X, Circle } from 'lucide-react';
import { Box, Avatar } from '@mui/material';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
// constants
import assets from '@/constants';
interface SettingDialogProps {
  open: boolean;
  onClose: (action: boolean) => void; // Function to call with the action result
  contents?: React.ReactNode;
}

const SettingDialog: React.FC<SettingDialogProps> = ({
  open,
  onClose,
  contents,
}) => {
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '8px',
          // maxWidth: '330px',
        },
      }}
    >
      <DialogContent
        sx={{
          padding: '0', // 16px
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <Box
          sx={{
            paddingTop: '24px',
            paddingX: '24px',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              right: '8px',
              top: '8px',
            }}
          >
            <X size={24} onClick={() => onClose(false)} />
          </Box>
          <Avatar
            alt={communityProfile.profile_name || 'me'}
            src={
              communityProfile.profile_avatar_url ||
              assets.images.app.defaultAvatar
            }
            sx={{
              width: '74px',
              height: '74px',
              margin: 'auto',
            }}
          ></Avatar>
          <div
            aria-label="spacer"
            className="tw-pt-[8px]"
            aria-hidden="true"
          ></div>
          <div className="headline-small tw-text-primarySwatch-40 tw-text-center">
            {communityProfile.profile_name || 'Mootiez'}
          </div>
        </Box>
        <div
          aria-label="spacer"
          className="tw-pt-[16px]"
          aria-hidden="true"
        ></div>

        {contents}
        <div
          aria-label="spacer"
          className="tw-pt-[16px]"
          aria-hidden="true"
        ></div>
        <Box
          sx={{
            paddingX: '24px',
            paddingBottom: '24px',
          }}
        >
          <div className="tw-flex tw-justify-center tw-items-center">
            <Button
              sx={{
                color: colors.primarySwatch.main[40],
              }}
              onClick={() => {
                window.open(
                  'https://www.iubenda.com/privacy-policy/30792539/legal',
                  '_blank', // <- This is what makes it open in a new window.
                );
              }}
            >
              <div
                className="label-large tw-text-neutralSwatch-50"
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                Privacy Policy
              </div>
            </Button>
            <Circle size={4} />
            <Button
              sx={{
                color: colors.primarySwatch.main[40],
              }}
              onClick={() => {
                window.open(
                  'https://www.mootiez.com/terms',
                  '_blank', // <- This is what makes it open in a new window.
                );
              }}
            >
              <div
                className="label-large tw-text-neutralSwatch-50"
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                Terms and Conditions
              </div>
            </Button>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SettingDialog;
