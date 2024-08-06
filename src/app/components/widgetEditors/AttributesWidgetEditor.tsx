import { usePersonaAttributeBadges } from '@/data/graphql/hooks/usePersonaAttributeBadges';
import {
  AttributesWidgetType,
  BaseProfileWidgetType,
} from '../../widgets/ProfileWidgetTypes';
import { Dispatch, SetStateAction, useState } from 'react';
import AttributeSelectionSheet from '../../../edit-profile/components/AttributeSelectionSheet.client';
import { BadgeHolding } from '@/data/graphql/models/PersonaAttributeBadges';
import { Typography, Button, Box } from '@mui/material';
import {} from 'lucide-react';
import AttributeCardGridView from '../../../edit-profile/components/AttributeCard.gridview';
import colors from '@/styles/colors.config';

type AttributesWidgetEditorProp = {
  editedWidgetData: AttributesWidgetType;
  setEditedWidgetData: Dispatch<SetStateAction<AttributesWidgetType>>;
};

export const AttributesWidgetEditor: React.FC<AttributesWidgetEditorProp> = ({
  editedWidgetData,
  setEditedWidgetData,
}) => {
  const {
    state: { userAttributesInit, userAttributes },
  } = usePersonaAttributeBadges();
  const [isAttributeSelectionOpen, setIsAttributeSelectionOpen] =
    useState(false);
  const selectedAttributes = editedWidgetData.attributes?.attributes || [];

  return (
    <>
      <Box width="100%">
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          sx={{
            alignItems: 'center',
          }}
        >
          <Typography
            variant="titleMedium"
            color={colors.neutralSwatch.main[30]}
            textAlign={'left'}
          >
            Selected Attributes
          </Typography>
          <Button onClick={() => setIsAttributeSelectionOpen(true)}>
            <Typography
              variant="labelLarge"
              color={colors.primarySwatch.main[40]}
              fontFamily={'Neue Metana'}
            >
              Manage
            </Typography>
          </Button>
        </Box>
        <Box sx={{ paddingTop: '12px' }} aria-label="spacer" />
        <Box
          display={'flex'}
          flexDirection={'row'}
          sx={{
            // justifyContent: 'flex-start',
            // alignItems: 'flex-start',
            // width: '100%',
            // gap: '16px',

            // use grid layout, and wrap to second row if more than 4
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))',
            gap: '8px',
          }}
        >
          {selectedAttributes.map((attribute, index) => (
            <AttributeCardGridView key={index} attributeBadge={attribute} />
          ))}
        </Box>
      </Box>

      <AttributeSelectionSheet
        key={JSON.stringify(selectedAttributes)}
        maxSelection={6}
        open={isAttributeSelectionOpen}
        onClose={() => setIsAttributeSelectionOpen(false)}
        userAttributes={userAttributes}
        selectedAttributes={selectedAttributes}
        saveAttributes={(localSelectedAttributes: BadgeHolding[]) => {
          setEditedWidgetData((prev: AttributesWidgetType) => {
            return {
              id: prev.id,
              type: prev.type,
              layout: prev.layout,
              attributes: {
                attributes: localSelectedAttributes.map((badge) => {
                  return {
                    badgeMetadata: {
                      ...badge.badgeMetadata,
                    },
                    balance: badge.balance,
                    communityId: badge.communityId,
                    personaId: badge.personaId,
                    pointId: badge.pointId,
                    style_classes: [] as string[],
                  };
                }),
                style_classes: [] as string[],
              },
            };
          });
          setIsAttributeSelectionOpen(false);
        }}
      />
    </>
  );
};
