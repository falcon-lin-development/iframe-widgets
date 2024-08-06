'use client';
import React, { useMemo } from 'react';

// components
import {
  Avatar,
  Box,
  Divider as _Divider,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';

// hooks
import {
  WyrPostContent,
  WyrPostCreationReference,
} from '../../graphql/createWyrPostContextProvider';
import { WyrPost, Option } from '../../graphql/models/WyrPost';
import { INGAMESTATE, useGameState } from '../gameScene/useGameState';
import { PickerOrientation } from './DefaultPicker';

// constant
import { themeColors } from '@/styles/mui/mootiezTheme';
import { Pointer } from 'lucide-react';
import colors from '@/styles/colors.config';

const MotionBox = motion(Box); // Create a motion component from Box
const MotionTypography = motion(Typography); // Create a motion component from Typography
const MotionDivider = motion(_Divider);

type DefaultPickerProps = {
  wyrPost?: WyrPost;
  wyrPostReference?: WyrPostCreationReference;
  scaleY?: number;
  orientation?: PickerOrientation;
  sx?: SxProps<Theme>;
};

const DefaultBackground = `
radial-gradient(67.44% 142.74% at 0% 100%, #FCD5C8 0%, rgba(252, 213, 200, 0.1) 100%), 
radial-gradient(69.71% 143.67% at 100% 100%, rgba(157, 173, 255, 0.7) 0%, rgba(157, 173, 255, 0.1) 100%) , 
radial-gradient(50% 117.29% at 100% 2.21%, #87E4F9 0%, rgba(135, 228, 249, 0.1) 100%) , 
radial-gradient(50% 116.78% at 0% 0%, rgba(234, 89, 165, 0.5) 0%, rgba(234, 89, 165, 0.1) 100%), 
#FFFFFF;
`;
const DefaultPickerDisplay: React.FC<DefaultPickerProps> = ({
  wyrPost,
  wyrPostReference,
  scaleY = 1,
  orientation = PickerOrientation.Vertical,
  sx,
}) => {
  const _wyrPostContent = useMemo(() => {
    return (
      wyrPost?.postContent ||
      wyrPostReference?.post_content_map ||
      ({
        caption: 'Would you rather?',
        options: [
          { option_id: '1', option_text: 'Option 1' },
          { option_id: '2', option_text: 'Option 2' },
        ],
      } as WyrPostContent)
    );
  }, [wyrPost]);

  const topPaddingHeight = useMemo(() => {
    return 52 / scaleY;
  }, [scaleY]);

  return (
    <>
      <ScalableBGContainer
        scaleY={scaleY}
        sx={{
          // aspectRatio: 'auto',
          aspectRatio: '375 / 343',
          borderRadius: '8px',
          background:
            _wyrPostContent.decoration?.background || DefaultBackground, // custom background show here
          ...sx,
        }}
      >
        {PickerOrientation.Horizontal === orientation && (
          <MotionBox sx={{ height: `${topPaddingHeight}px` }}></MotionBox>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection:
              orientation === PickerOrientation.Vertical ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            flexGrow: 1,
            padding: '16px',
          }}
        >
          <Half
            option={_wyrPostContent.options[0]}
            scaleY={scaleY}
            sx={{
              marginBottom: '8px',
            }}
          />
          <Divider scaleY={scaleY} pickerOrientation={orientation} />
          <Half
            option={_wyrPostContent.options[1]}
            scaleY={scaleY}
            sx={{
              marginTop: '8px',
            }}
          />
          <MotionBox // this finger would exist for now
            style={{
              scaleY: scaleY ? 1 / scaleY : 1, // Inverse of parent scale
              transformOrigin: 'top',
              position: 'absolute',
              top: orientation === PickerOrientation.Vertical ? '40%' : '70%',
              right: '5%',
            }}
          >
            <Pointer
              color="white"
              style={{
                transform: 'rotate(-45deg)',
              }}
              size={20}
            />
          </MotionBox>
        </Box>
      </ScalableBGContainer>
    </>
  );
};

export default DefaultPickerDisplay;

// Sub Components
const ScalableBGContainer: React.FC<{
  scaleY: number;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}> = ({ scaleY, children, sx }) => {
  return (
    <MotionBox
      style={{
        scaleY: scaleY,
        transformOrigin: 'top',
      }}
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: colors.neutralSwatch.main[10],
        ...sx,
      }}
    >
      {children}
    </MotionBox>
  );
};

/**
 * Half Gaming Section that is important
 * @param param0
 * @returns
 */

const Half: React.FC<{
  option: Option;
  scaleY?: number;
  sx?: SxProps<Theme>;
}> = ({ option, scaleY, sx }) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '50%',
        ...sx,
      }}
    >
      <MotionTypography
        variant="bodyLarge"
        style={{
          scaleY: scaleY ? 1 / scaleY : 1, // Inverse of parent scale
          transformOrigin: 'top',
          fontWeight: 700,
        }}
      >
        {option.option_text}
      </MotionTypography>
    </Box>
  );
};

const Divider: React.FC<{
  scaleY?: number;
  pickerOrientation: PickerOrientation;
}> = ({ scaleY, pickerOrientation }) => {
  const combinedTransforms = `
    scaleY(${scaleY ? 1 / scaleY : 1})
    translateY(-50%)
  `;

  if (pickerOrientation === PickerOrientation.Vertical) {
    return (
      <MotionBox
        sx={{
          position: 'absolute',
          top: '50%', // transform: 'translateY(-50%) !important',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: 'calc(100% - 32px)', // 16px padding on each side
          color: colors.white,
        }}
        style={{
          transform: combinedTransforms,
        }}
      >
        <_Divider sx={{ flexGrow: 1, borderColor: 'white' }} />
        <Typography
          variant="labelMedium"
          sx={{
            paddingX: '16px',
          }}
        >
          or
        </Typography>
        <_Divider sx={{ flexGrow: 1, borderColor: 'white' }} />
      </MotionBox>
    );
  } else {
    return (
      <MotionDivider
        sx={{
          width: '1px',
          height: '70%',
          backgroundColor: colors.white,
          position: 'absolute',
          top: '15%',
        }}
      />
    );
  }
};
