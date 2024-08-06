'use client';

import {
  Badge,
  Box,
  Checkbox,
  Chip,
  Dialog,
  IconButton,
  Typography,
} from '@mui/material';

// skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';

// components
import { X } from 'lucide-react';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import AttributeCard from './AttributeCard';
import { CheckIcon } from '@/app/[locale]/auth/login/TnCCheckbox.client';
import colors from '@/styles/colors.config';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

// models
import { BadgeHolding } from '@/data/graphql/models/PersonaAttributeBadges';

type AttributeSelectionSheetProps = {
  open: boolean;
  onClose: () => void;
  userAttributes: BadgeHolding[];
  selectedAttributes: BadgeHolding[];
  saveAttributes: (attributes: BadgeHolding[]) => void;
  maxSelection?: number;
};
const AttributeSelectionSheet: React.FC<AttributeSelectionSheetProps> = (
  props,
) => {
  const {
    open,
    onClose,
    userAttributes,
    selectedAttributes,
    saveAttributes,
    maxSelection = 4,
  } = props;

  const [localSelectedAttributes, setLocalSelectedAttributes] = useState<
    BadgeHolding[]
  >([]);

  // sync public profile selected attribute to local
  useEffect(() => {
    setLocalSelectedAttributes(selectedAttributes);
  }, [selectedAttributes]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      sx={{
        margin: 'auto',
      }}
      className="tw-max-w-mobile"
    >
      <Scaffold
        appbar={
          <AppBar
            backButton={
              <IconButton onClick={onClose}>
                <X />
              </IconButton>
            }
            title={
              <Typography variant="titleMedium" gutterBottom>
                Manage ({localSelectedAttributes.length}/{maxSelection})
              </Typography>
            }
            rightMostIcon={
              <LoadingButton
                onClick={() => saveAttributes(localSelectedAttributes)}
              >
                <Typography
                  variant="labelLarge"
                  sx={{
                    transform: 'translateY(2px)',
                  }}
                >
                  Save
                </Typography>
              </LoadingButton>
            }
          />
        }
        mainBody={
          <Box
            sx={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))',
                gap: '8px',
                width: '100%',
                alignItems: 'start',
                // justifyContent: 'center',
              }}
            >
              {userAttributes.map((attribute, index) => {
                const isSelected = Boolean(
                  localSelectedAttributes.find(
                    (selectedAttribute) =>
                      selectedAttribute.pointId === attribute.pointId,
                  ),
                );
                return (
                  <AttributeSelectionCard
                    key={attribute.pointId}
                    attributeBadge={attribute}
                    onSelect={(index) => {
                      if (isSelected) {
                        setLocalSelectedAttributes(
                          localSelectedAttributes.filter(
                            (selectedAttribute) =>
                              selectedAttribute.pointId !== attribute.pointId,
                          ),
                        );
                      } else {
                        if (localSelectedAttributes.length >= maxSelection) {
                          return;
                        }
                        setLocalSelectedAttributes([
                          ...localSelectedAttributes,
                          attribute,
                        ]);
                      }
                    }}
                    checkBoxString={
                      localSelectedAttributes.findIndex(
                        (selectedAttribute) =>
                          selectedAttribute.pointId === attribute.pointId,
                      ) +
                        1 +
                        '' || ''
                    }
                    isSelected={isSelected}
                  />
                );
              })}
            </Box>
          </Box>
        }
      />
    </Dialog>
  );
};

export default AttributeSelectionSheet;

const AttributeSelectionCard: React.FC<{
  attributeBadge: BadgeHolding;

  checkBoxString: string;
  onSelect: (imageUrl: string) => void;
  isSelected: boolean;
}> = ({ attributeBadge, onSelect, isSelected, checkBoxString }) => {
  const url = attributeBadge.badgeMetadata.thumbnail_url;
  return (
    <>
      <Box
        // id="attribute-card"
        onClick={() => onSelect(url)}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
      >
        <Badge
          badgeContent={
            <Checkbox
              icon={
                <Box
                  sx={{
                    width: '20px',
                    height: '20px',
                  }}
                >
                  <CheckBoxOutlineBlankIcon
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '0.25rem',
                    }}
                  />
                </Box>
              }
              checkedIcon={
                <Box
                  sx={{
                    background: colors.primarySwatch.main[40],
                    borderRadius: '8px',
                    width: '24px',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translateX(4px)',
                  }}
                >
                  <Typography
                    variant="labelSmall"
                    color={colors.white}
                    sx={{
                      transform: 'translateY(1px)',
                      // fontSize: '12px',
                    }}
                  >
                    {checkBoxString}
                  </Typography>
                </Box>
              }
              checked={isSelected}
              sx={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                zIndex: 1,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            />
          }
        >
          <AttributeCard
            sx={{
              '& .MuiBox-root.attr-icon': {
                border: isSelected ? '2px solid' : '1px solid',
                borderColor: isSelected
                  ? colors.primarySwatch.main[40]
                  : colors.primarySwatch.main[90],
              },
              '& .MuiTypography-root': {
                color: colors.neutralSwatch.main[10],
              },
            }}
            attributeBadge={attributeBadge}
          />
        </Badge>
      </Box>
    </>
  );
};
