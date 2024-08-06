'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

// components
import {
  Avatar,
  Box,
  Divider as _Divider,
  SxProps,
  Theme,
  Typography,
  Button,
} from '@mui/material';
import { motion, useAnimation } from 'framer-motion';

// hooks
import { WyrPost, Option, isWyrPost } from '../../graphql/models/WyrPost';
import { GameStateHook, INGAMESTATE } from '../gameScene/useGameState';

// constant
import { Pointer, SkipForward } from 'lucide-react';
import colors from '@/styles/colors.config';
import CountUpAnimation from '@/components/CountAnimation';
import { isMobile } from 'react-device-detect';

const MotionBox = motion(Box); // Create a motion component from Box
const MotionTypography = motion(Typography); // Create a motion component from Typography
const MotionDivider = motion(_Divider);

export enum PickerOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

type DefaultPickerProps = {
  wyrPost: WyrPost;
  gameContext: GameStateHook; // TODO: need to abstract this away to only crucial gamestates
  orientation?: PickerOrientation;
  scaleY?: number;
  nextQuestion?: () => void;
  sx?: SxProps<Theme>;
};

const DefaultBackground = `
radial-gradient(67.44% 142.74% at 0% 100%, #FCD5C8 0%, rgba(252, 213, 200, 0.1) 100%), 
radial-gradient(69.71% 143.67% at 100% 100%, rgba(157, 173, 255, 0.7) 0%, rgba(157, 173, 255, 0.1) 100%) , 
radial-gradient(50% 117.29% at 100% 2.21%, #87E4F9 0%, rgba(135, 228, 249, 0.1) 100%) , 
radial-gradient(50% 116.78% at 0% 0%, rgba(234, 89, 165, 0.5) 0%, rgba(234, 89, 165, 0.1) 100%), 
#FFFFFF;
`;

const _useViewPost = (
  { gameContext }: { gameContext: GameStateHook },
  wyrPost: WyrPost,
) => {
  const { ref, inView, entry } = useInView({
    // triggerOnce: true,
    threshold: 0.5, // Triggers when 10% of the element is visible
  });
  const hasTriggeredRef = useRef<boolean>(false); // To track if the function has been triggered
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // To manage the timeout

  useEffect(() => {
    if (inView) {
      // Set a timeout when the element comes into view
      timerRef.current = setTimeout(() => {
        if (inView && !hasTriggeredRef.current) {
          gameContext.actions.viewWyrPost();
          hasTriggeredRef.current = true; // Update the ref to indicate the function has been triggered
        }
      }, 1000); // Set to 500 ms
    } else {
      // Clear the timeout if the element goes out of view
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    // Cleanup function to clear the timeout when the component unmounts or inView changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [inView]);

  return {
    ref,
  };
};

const DefaultPicker: React.FC<DefaultPickerProps> = ({
  wyrPost,
  gameContext,
  orientation = PickerOrientation.Vertical,
  scaleY = 1,
  nextQuestion,
  sx,
}) => {
  const _wyrPostContent = useMemo(() => wyrPost.postContent, [wyrPost]);
  const topPaddingHeight = useMemo(() => {
    return 52 / scaleY;
  }, [scaleY]);
  const _isWyrPost = isWyrPost(wyrPost);

  // logic gate

  if (!_isWyrPost.isValid) {
    return (
      <InvalidPicker
        wyrPost={wyrPost}
        gameContext={gameContext}
        orientation={orientation}
        scaleY={scaleY}
        sx={sx}
      />
    );
  }

  return (
    <>
      <ScalableBGContainer
        gameContext={gameContext}
        wyrPost={wyrPost}
        scaleY={scaleY}
        sx={{
          position: 'relative',
          aspectRatio: 'auto',
          background:
            _wyrPostContent.decoration?.background || DefaultBackground, // custom background show here
          ...sx,
        }}
      >
        {/* portrait top padding */}
        {PickerOrientation.Horizontal === orientation && (
          <MotionBox sx={{ height: `${topPaddingHeight}px` }}></MotionBox>
        )}
        {/* Option shadows */}
        {gameContext.state.inGameState !== INGAMESTATE.QUESTION &&
          !gameContext.helpers.isOptionSelected(_wyrPostContent.options[0]) && (
            <Option1Shadow orientation={orientation} />
          )}
        {gameContext.state.inGameState !== INGAMESTATE.QUESTION &&
          !gameContext.helpers.isOptionSelected(_wyrPostContent.options[1]) && (
            <Option2Shadow orientation={orientation} />
          )}
        {/* pointer decoration */}
        {gameContext.state.inGameState === INGAMESTATE.QUESTION && (
          <>
            <PointerDecorator orientation={orientation} scaleY={scaleY} />
            <PointerDecorator
              orientation={orientation}
              scaleY={scaleY}
              atTop={false}
            />
          </>
        )}
        {/* next question tag */}
        {gameContext.state.inGameState !== INGAMESTATE.QUESTION &&
          nextQuestion && (
            <NextButton nextQuestion={nextQuestion} scaleY={scaleY} />
          )}

        <Box
          sx={{
            display: 'flex',
            flexDirection:
              orientation === PickerOrientation.Vertical ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            position: 'relative',
            // padding: '16px',
          }}
        >
          <Half
            option={_wyrPostContent.options[0]}
            scaleY={scaleY}
            gameContext={gameContext}
            orientation={orientation}
          />
          {
            // if skipped, change the divider
            gameContext.state.inGameState === INGAMESTATE.RESULT &&
            gameContext.state.isSkipped ? (
              <Divider
                scaleY={scaleY}
                pickerOrientation={orientation}
                text="You skipped this question in the past"
                sx={{
                  zIndex: 2,
                }}
              />
            ) : (
              <Divider scaleY={scaleY} pickerOrientation={orientation} />
            )
          }
          <Half
            option={_wyrPostContent.options[1]}
            scaleY={scaleY}
            gameContext={gameContext}
          />
        </Box>
      </ScalableBGContainer>
    </>
  );
};

export default DefaultPicker;

/**
 * Other Components
 * @param param0
 * @returns
 */
const InvalidPicker: React.FC<DefaultPickerProps> = ({
  gameContext,
  wyrPost,
  scaleY = 1,
  sx,
}) => {
  const _isWyrPost = isWyrPost(wyrPost);
  console.log('InvalidPicker', _isWyrPost);

  return (
    <>
      <ScalableBGContainer
        gameContext={gameContext}
        wyrPost={wyrPost}
        scaleY={scaleY}
        sx={{
          aspectRatio: 'auto',
          background: DefaultBackground, // custom background show here
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          ...sx,
        }}
      >
        <MotionTypography
          variant="labelMedium"
          style={{
            transform: `scaleY(${scaleY ? 1 / scaleY : 1})`,
            color: colors.white,
          }}
        >
          question not available
        </MotionTypography>
      </ScalableBGContainer>
    </>
  );
};

const ScalableBGContainer: React.FC<{
  scaleY: number;
  children: React.ReactNode;
  gameContext: GameStateHook;
  wyrPost: WyrPost;
  sx?: SxProps<Theme>;
}> = ({ scaleY, children, sx, gameContext, wyrPost }) => {
  const { ref } = _useViewPost({ gameContext }, wyrPost);

  return (
    <MotionBox
      ref={ref}
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

const Divider: React.FC<{
  scaleY?: number;
  text?: string;
  sx?: SxProps<Theme>;
  pickerOrientation: PickerOrientation;
}> = ({ scaleY, pickerOrientation, text = 'or', sx }) => {
  const combinedTransforms = `
    scaleY(${scaleY ? 1 / scaleY : 1})
    translateY(-50%)
  `;

  if (pickerOrientation === PickerOrientation.Vertical) {
    return (
      <MotionBox
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          width: 'calc(100% - 32px)', // 16px padding on each side
          top: '50%',
          color: colors.white,
          ...sx,
        }}
        style={{
          transform: combinedTransforms,
          // scaleY: scaleY ? 1 / scaleY : 1, // Inverse of parent scale
          // transformOrigin: 'top',
        }}
      >
        <_Divider sx={{ flexGrow: 1, borderColor: 'white' }} />
        <Typography
          variant="labelMedium"
          sx={{
            paddingX: '16px',
          }}
        >
          {text}
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
        // style={{
        //   scaleY: scaleY ? 1 / scaleY : 1, // Inverse of parent scale
        //   transformOrigin: 'top',
        // }}
      />
    );
  }
};

const Half: React.FC<{
  option: Option;
  scaleY: number;
  gameContext: GameStateHook;
  orientation?: PickerOrientation;
}> = ({ option, scaleY, gameContext, orientation }) => {
  const [isHovered, setIsHovered] = useState(false); // State to track hover
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start('show');
  }, []);

  React.useEffect(() => {
    if (gameContext.state.inGameState === INGAMESTATE.QUESTION) {
      if (isHovered) {
        controls.start('hover');
      } else {
        controls.start('show');
      }
    }
  }, [isHovered, gameContext.state.inGameState, controls]);

  if (
    gameContext.state.inGameState === INGAMESTATE.QUESTION ||
    gameContext.state.inGameState === INGAMESTATE.SUMMITING ||
    gameContext.state.inGameState === INGAMESTATE.RESULT
  ) {
    return (
      <>
        <MotionBox
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            padding:
              orientation === PickerOrientation.Vertical
                ? '8px 40px'
                : '8px 12px',
            '&:hover': {
              cursor:
                gameContext.state.inGameState === INGAMESTATE.QUESTION
                  ? 'pointer'
                  : 'default',
            },
            overflow: 'hidden',
          }}
          onMouseEnter={!isMobile ? () => setIsHovered(true) : undefined} // Set hover state to true when mouse enters
          onMouseLeave={!isMobile ? () => setIsHovered(false) : undefined} // Set hover state to false when mouse leaves
          onTouchStart={isMobile ? () => setIsHovered(true) : undefined}
          onTouchEnd={isMobile ? () => setIsHovered(false) : undefined}
          onClick={() => {
            if (gameContext.state.inGameState === INGAMESTATE.QUESTION) {
              gameContext.actions.voteWyrPost(option.option_id);
            }
          }}
        >
          <MotionBox // content block
            id="outerScaleBox"
            style={{
              scaleY: scaleY ? 1 / scaleY : 1, // Inverse of parent scale
              textAlign: 'center',
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MotionBox
              initial="hidden"
              animate={controls}
              variants={{
                hidden: {
                  y: -20,
                  opacity: 0.2,
                  scale: 1,
                  transition: {
                    duration: 0.5, // Adjust as needed
                  },
                },
                hover: {
                  y: -30,
                  opacity: 1,
                  scale: 1.1,
                  transition: { duration: 1 },
                },
                show: {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  transition: {
                    duration: 1, // Adjust as needed
                  },
                },
              }}
            >
              <Typography
                variant="bodyLarge"
                sx={{
                  fontFamily: 'Neue Metana, sans-serif',
                  fontWeight: '700',
                }}
              >
                {option.option_text}
              </Typography>
            </MotionBox>

            {gameContext.state.inGameState === INGAMESTATE.SUMMITING && (
              <SubmittingSection />
            )}

            {gameContext.state.inGameState === INGAMESTATE.RESULT &&
              !gameContext.state.isSkipped && (
                <>
                  <Box
                    sx={{
                      width: '100%',
                      height: PickerOrientation.Vertical ? '16px' : '0px',
                    }}
                    aria-label="spacer"
                  />
                  <ScoreSection option={option} gameContext={gameContext} />
                </>
              )}
          </MotionBox>
        </MotionBox>
      </>
    );
  } else {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '50%',
        }}
      >
        <MotionTypography
          variant="bodyLarge"
          style={{
            scaleY: scaleY ? 1 / scaleY : 1, // Inverse of parent scale
            transformOrigin: 'top',
          }}
        >
          {option.option_text}
        </MotionTypography>
      </Box>
    );
  }
};

const SubmittingSection: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '8px',
        }}
        aria-label="spacer"
      />
      <Typography
        variant="bodySmall"
        sx={{
          fontFamily: 'Neue Metana, sans-serif',
          fontWeight: '700',
          color: colors.neutralSwatch.main[40],
        }}
      >
        calculating...
      </Typography>
    </>
  );
};

const ScoreSection: React.FC<{
  option: Option;
  gameContext: GameStateHook;
}> = ({ option, gameContext }) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 24px',
          borderRadius: '99999rem',
          backgroundColor: colors.white,
        }}
      >
        <Typography
          variant="bodyMedium"
          sx={{
            fontFamily: 'Basier Circle, sans-serif',
            color: colors.neutralSwatch.main[50],
          }}
        >
          Avg.
        </Typography>
        <Typography
          variant="headlineSmall"
          sx={{
            color: colors.primarySwatch.lavender[40],
            fontFamily: 'Neue Metana, sans-serif',
            fontWeight: '700',
          }}
        >
          <CountUpAnimation
            targetNumber={gameContext.helpers.calcVotePct(option)}
          />
          %
        </Typography>
      </Box>
    </>
  );
};

/**
 * Other Decorations
 */

const Option1Shadow: React.FC<{
  orientation: PickerOrientation;
}> = ({ orientation }) => {
  return (
    <Box // option1 shadow
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: PickerOrientation.Vertical === orientation ? 0 : '50%',
        bottom: PickerOrientation.Vertical === orientation ? '50%' : 0,
        backgroundColor: 'black',
        opacity: 0.3,
        zIndex: 1,
      }}
    />
  );
};

const Option2Shadow: React.FC<{
  orientation: PickerOrientation;
}> = ({ orientation }) => {
  return (
    <Box // option2 shadow
      sx={{
        position: 'absolute',
        top: PickerOrientation.Vertical === orientation ? '50%' : 0,
        left: PickerOrientation.Vertical === orientation ? 0 : '50%',
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        opacity: 0.3,
        zIndex: 1,
      }}
    />
  );
};

const PointerDecorator: React.FC<{
  sx?: SxProps<Theme>;
  orientation: PickerOrientation;
  scaleY: number;
  atTop?: boolean;
}> = ({ sx, orientation, scaleY, atTop = true }) => {
  return (
    <MotionBox
      style={{
        scaleY: scaleY ? 1 / scaleY : 1, // Inverse of parent scale
      }}
      animate={{
        y: [0, -10],
        x: [0, -10],
        scale: [1.1, 1],
      }}
      transition={{
        // repeat: 1,
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      sx={{
        position: 'absolute',
        right:
          orientation === PickerOrientation.Vertical
            ? '5%'
            : atTop
              ? '55%'
              : '5%',
        top:
          orientation === PickerOrientation.Vertical
            ? atTop
              ? '42%'
              : '92%'
            : '70%',
        ...sx,
      }}
    >
      <Pointer
        color={colors.toRGBA(colors.neutralSwatch.main[98], 0.8)}
        size={20}
        style={{
          transform: 'rotate(-45deg)',
        }}
      />
    </MotionBox>
  );
};

const NextButton: React.FC<{
  nextQuestion: () => void;
  scaleY: number;
}> = ({ nextQuestion, scaleY }) => {
  return (
    <>
      <MotionBox
        style={{
          scaleY: scaleY ? 1 / scaleY : 1, // Inverse of parent scale
        }}
        sx={{
          position: 'absolute',
          bottom: `calc(16px*${1 / scaleY})`,
          right: '16px',
          zIndex: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            background: 'rgba(0, 0, 0, 0.32)',
            padding: '8px 16px',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.32)',
            },
          }}
          onClick={nextQuestion}
          endIcon={<SkipForward size={16} />}
        >
          <Typography
            variant="labelLarge"
            sx={{
              transform: 'translateY(2px)',
              color: colors.white,
            }}
          >
            Next
          </Typography>
        </Button>
      </MotionBox>
    </>
  );
};
