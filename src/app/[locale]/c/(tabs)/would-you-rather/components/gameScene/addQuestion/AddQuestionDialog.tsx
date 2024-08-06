'use client';
import React, { use, useEffect, useMemo, useRef, useState } from 'react';

// components
import {
  Box,
  Dialog,
  Typography,
  IconButton,
  InputAdornment,
  Grid,
  Checkbox,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import colors from '@/styles/colors.config';
import TextField from '@mui/material/TextField';
import { ChevronDown, X } from 'lucide-react';
import {
  SectionsBottomModalSheet,
  SelectionOption,
} from '@/components/SelectionSheet/BottomModalSelectionSheet.client';

// hooks
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { usePageState } from '../../../pageStateContextProvider';
import {
  CreateWyrPostParams,
  useCreateWyrPost,
} from '../../../graphql/createWyrPostContextProvider';
import {
  PostCategory,
  WyrDecorationType,
} from '../../../graphql/models/createWyrPost';

// constants
import { ButtonID } from '@/constants';
import WyrBGOptions from '@/styles/bgOptions/WyrBGOptions';
import { isMobile } from 'react-device-detect';
import { LoadingButton } from '@mui/lab';

const postCategoryOptions: SelectionOption[] = [
  {
    title: 'UGC',
    targetValue: PostCategory.ugc,
  },
  {
    title: 'Normal',
    targetValue: PostCategory.normal,
  },
  {
    title: 'Popular',
    targetValue: PostCategory.popular,
  },
  {
    title: 'Sponsored',
    targetValue: PostCategory.sponsored,
  },
];

const _useBgSectionOptions = () => {
  const [bgSelectedOptionIndex, setBgSelectedOptionIndex] = useState<number>(0);

  return {
    bgOptions: WyrBGOptions,
    bgSelectedOptionIndex,
    setBgSelectedOptionIndex,
  };
};

const _useAddWyrForm = () => {
  const [postCategory, setPostCategory] = useState<PostCategory>(
    PostCategory.ugc,
  );
  const [sponsorId, setSponsorId] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [option1, setOption1] = useState<string>('');
  const [option2, setOption2] = useState<string>('');
  const { bgOptions, bgSelectedOptionIndex, setBgSelectedOptionIndex } =
    _useBgSectionOptions();

  const bg = useMemo(
    () => bgOptions[bgSelectedOptionIndex],
    [bgSelectedOptionIndex],
  );

  const resetStates = () => {
    setCaption('');
    setOption1('');
    setOption2('');
    // setPostCategory(PostCategory.ugc);
    // setSponsorId("");
  };

  /**
   * clear sponsorId when postCategory is not sponsored
   */
  useEffect(() => {
    if (postCategory !== PostCategory.sponsored) {
      setSponsorId('');
    }
  }, [postCategory]);

  return {
    $postCategory: {
      value: postCategory,
      setPostCategory,
    },
    $caption: {
      value: caption,
      setCaption,
    },
    $option1: {
      value: option1,
      setOption1,
    },
    $option2: {
      value: option2,
      setOption2,
    },
    $sponsorId: {
      value: sponsorId,
      setSponsorId,
    },
    $background: {
      options: bgOptions,
      value: bg,
      bgSelectedOptionIndex,
      setBgSelectedOptionIndex,
    },
    resetStates,
  };
};

const AddQuestionDialog: React.FC<{
  open: boolean;
  onClose: (action: boolean, data?: Record<string, any>) => void; // Function to call with the action result
  onConfirm: (formData: CreateWyrPostParams) => void;
}> = ({ open, onClose, onConfirm }) => {
  const { logButtonClick } = useLogEvent();
  const {
    $postCategory: { value: postCategory, setPostCategory },
    $caption: { value: caption, setCaption },
    $option1: { value: option1, setOption1 },
    $option2: { value: option2, setOption2 },
    $sponsorId: { value: sponsorId, setSponsorId },
    $background: {
      value: background,
      options: bgOptions,
      bgSelectedOptionIndex,
      setBgSelectedOptionIndex,
    },
    resetStates,
  } = _useAddWyrForm();
  const { createWyrPostState } = useCreateWyrPost();
  const {
    state: { communityProfile },
  } = usePageState();

  // UXstates
  const [postCategorySelectionOpen, setPostCategorySelectionOpen] =
    useState<boolean>(false);
  const addingQuestion = useMemo(
    () => createWyrPostState.fetching,
    [createWyrPostState],
  );

  // display helpers
  const MAX_CHAR_COUNT = 100;
  const getHelperText = (text: string) => {
    if (text.length > MAX_CHAR_COUNT) {
      return `Limit exceeded by ${text.length - MAX_CHAR_COUNT} characters.`;
    } else {
      return `${text.length}/${MAX_CHAR_COUNT}`;
    }
  };

  // Action
  const validateAndSubmit = async () => {
    try {
      if (!(option1.length > 0 && option2.length > 0)) {
        throw new Error('Please fill both options');
      }
      if (
        option1.length > MAX_CHAR_COUNT ||
        option2.length > MAX_CHAR_COUNT ||
        caption.length > MAX_CHAR_COUNT
      ) {
        throw new Error('Max Character count exceeded');
      }

      const _form = {
        // do nothing after call this
        post: {
          caption: caption,
          options: [
            {
              option_id: '1',
              option_text: option1,
            },
            {
              option_id: '2',
              option_text: option2,
            },
          ],
          decoration: {
            type: WyrDecorationType.gradient,
            background: background.background,
          },
        },
        postCategory: postCategory,
        sponsorId: sponsorId || '',
      };
      console.log('validateAndSubmit:', _form);
      onConfirm(_form);
    } catch (error) {
      console.error('Error validateAndSubmit:', error);
      alert(error);
    }
  };

  // components
  const Header: React.FC = () => {
    return (
      <Box // title
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '8px',
          height: '56px',
          padding: '10px 8px',
        }}
      >
        <IconButton
          onClick={() => {
            onClose(true);
            resetStates();
          }}
        >
          <X />
        </IconButton>
        <Typography
          variant="titleMedium"
          sx={{
            color: colors.neutralSwatch.main[10],
          }}
        >
          Create
        </Typography>
      </Box>
    );
  };
  const Footer: React.FC = () => {
    return (
      <Box // bottom
        sx={{
          textAlign: 'left',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '8px',
          height: '56px',
          padding: '10px 8px',
        }}
      >
        <LoadingButton
          variant="contained"
          sx={{
            padding: '10px 49px',
          }}
          loading={addingQuestion}
          onClick={async () => {
            logButtonClick(ButtonID.would_you_rather.submit_question, '');
            validateAndSubmit().then(() => {
              resetStates(); // after validate and submit, then clear state;
            });
          }}
        >
          {/* {addingQuestion && <CircularProgress size={24} />} */}
          <Typography variant="labelLarge">Submit</Typography>
        </LoadingButton>
      </Box>
    );
  };

  const AdminSection = () => {
    return (
      <>
        {/* Post Category */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="titleLarge"
            sx={{
              marginY: '6px',
            }}
          >
            Post Category
          </Typography>
          <Typography
            variant="labelLarge"
            sx={{
              marginY: '6px',
              padding: '4px 10px',
              borderRadius: '4px',
              color: colors.secondarySwatch.lavender[10],
              backgroundColor: colors.secondarySwatch.lavender[90],
              '&:hover': {
                cursor: 'pointer',
              },
            }}
            onClick={(e) => {
              e.preventDefault();
              setPostCategorySelectionOpen((prev) => !prev);
            }}
          >
            {postCategory}
            <ChevronDown
              size={16}
              style={{
                display: 'inline',
              }}
            />
          </Typography>
          <SectionsBottomModalSheet
            isOpen={postCategorySelectionOpen}
            setOpen={() => setPostCategorySelectionOpen(false)}
            setSelectedValue={(targetValue: PostCategory) => {
              setPostCategory(targetValue);
            }}
            info={{
              options: postCategoryOptions,
            }}
          />
        </Box>
        {/* Sponsor Id */}
        {postCategory === PostCategory.sponsored && (
          <Box sx={{ width: '100%' }}>
            <Typography
              variant="titleLarge"
              sx={{
                marginY: '6px',
              }}
            >
              Sponsor Id (optional)
            </Typography>
            <Box sx={{ paddingTop: '8px' }} aria-label="spacer"></Box>
            <TextField
              sx={{
                '& .MuiInput-underline:after': {
                  borderBottomColor: colors.primarySwatch.main[80],
                },
                '& .MuiFormHelperText-root': {
                  textAlign: 'right',
                },
              }}
              hiddenLabel
              // label="Sponsored ID"
              variant="filled"
              placeholder="Sponsored ID"
              value={sponsorId}
              onChange={(e) => setSponsorId(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: sponsorId && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSponsorId('')} edge="end">
                      <CancelIcon className="tw-text-neutralSwatch-30" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
      </>
    );
  };

  /**
   *
   * Return Statement
   */
  return (
    <Dialog
      open={open}
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '430px', // max-width
          backgroundColor: colors.primarySwatch.lavender[98],
          // padding: '16px',
        },
      }}
      fullScreen
    >
      <>
        <Header />
        <Box // body
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            height: isMobile ? 'unset' : '100%',

            width: '100%',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: colors.white,
            color: colors.neutralSwatch.main[30],
            gap: '24px',
          }}
        >
          {
            communityProfile?.states?.roles?.includes('admin') && AdminSection() // use this to prevent auto unfocus
          }
          <Box sx={{ width: '100%' }}>
            <Typography
              variant="titleLarge"
              sx={{
                marginY: '6px',
              }}
            >
              Question
            </Typography>
            <Box sx={{ paddingTop: '8px' }} aria-label="spacer"></Box>

            <TextField
              sx={{
                '& .MuiInput-underline:after': {
                  borderBottomColor: colors.primarySwatch.main[80],
                },
                '& .MuiFormHelperText-root': {
                  textAlign: 'right',
                  color: getHelperText(option1).includes('character')
                    ? 'red'
                    : 'inherit',
                },
              }}
              hiddenLabel
              // label="Option 1"
              variant="filled"
              placeholder="Option 1"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: option1 && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setOption1('')} edge="end">
                      <CancelIcon className="tw-text-neutralSwatch-30" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={getHelperText(option1)}
            />
            <Box sx={{ paddingTop: '8px' }} aria-label="spacer"></Box>
            <TextField
              sx={{
                '& .MuiInput-underline:after': {
                  borderBottomColor: colors.primarySwatch.main[80],
                },
                '& .MuiFormHelperText-root': {
                  textAlign: 'right',
                  color: getHelperText(option2).includes('character')
                    ? 'red'
                    : 'inherit',
                },
              }}
              hiddenLabel
              // label="Option 2"
              variant="filled"
              placeholder="Option 2"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: option2 && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setOption2('')} edge="end">
                      <CancelIcon className="tw-text-neutralSwatch-30" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={getHelperText(option2)}
            />
          </Box>

          <Box sx={{ width: '100%' }}>
            <Typography
              variant="titleLarge"
              sx={{
                marginY: '6px',
              }}
            >
              Background
            </Typography>
            <Box sx={{ paddingBottom: '8px' }} aria-label="spacer"></Box>
            <Grid container spacing={2}>
              {...bgOptions.map((option, index) => {
                return (
                  <Grid
                    item
                    xs={4}
                    key={index}
                    sx={{
                      aspectRatio: '1/1',
                    }}
                  >
                    <Box
                      sx={{
                        background: option.background,
                        height: '100%',
                        borderRadius: '8px',
                        position: 'relative',
                        border:
                          bgSelectedOptionIndex === index
                            ? '2px solid'
                            : 'none',
                        borderColor: colors.primarySwatch.lavender[40],
                      }}
                      onClick={() => setBgSelectedOptionIndex(index)}
                    >
                      <Checkbox
                        sx={{
                          position: 'absolute',
                          bottom: '0',
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                          '&.Mui-checked': {
                            color: colors.primarySwatch.lavender[40], // Change this to your desired checked color
                          },
                        }}
                        checked={bgSelectedOptionIndex === index} // Assuming selectedOptionIndex is the index of the currently selected option
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Box sx={{ width: '100%' }}>
            <Typography
              variant="titleLarge"
              sx={{
                marginY: '6px',
              }}
            >
              Caption (Optional)
            </Typography>
            <Box sx={{ paddingTop: '8px' }} aria-label="spacer"></Box>
            <TextField
              sx={{
                '& .MuiInput-underline:after': {
                  borderBottomColor: colors.primarySwatch.main[80],
                },
                '& .MuiFormHelperText-root': {
                  textAlign: 'right',
                  color: getHelperText(caption).includes('character')
                    ? 'red'
                    : 'inherit',
                },
              }}
              multiline
              hiddenLabel
              // label="Caption"
              rows={4}
              variant="filled"
              placeholder="Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: caption && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setCaption('')} edge="end">
                      <CancelIcon className="tw-text-neutralSwatch-30" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={getHelperText(caption)}
            />
          </Box>
        </Box>
        <Footer />
      </>
    </Dialog>
  );
};

export default AddQuestionDialog;
