'use client';
import { Box, Typography } from '@mui/material';
import React from 'react';

// hooks
import { AttributesWidgetType } from './ProfileWidgetTypes';
import AttributeCardGridView from '../../edit-profile/components/AttributeCard.gridview';
import { BadgeHolding } from '@/data/graphql/models/PersonaAttributeBadges';
// avatar widget

type AttributesWidgetProp = {
  defaultAttribute?: BadgeHolding;
  widgetData: AttributesWidgetType;
};

export const AttributesWidget: React.FC<AttributesWidgetProp> = ({
  widgetData,
  defaultAttribute,
}) => {
  const attributes = widgetData.attributes?.attributes;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        height: '100%',
        width: '100%',
        color: 'black',
      }}
    >
      {attributes && attributes.length > 0 ? (
        <>
          {attributes.map((attribute, index) => (
            <Box
              key={index}
              height={'100%'}
              sx={{
                // backgroundColor: "white",
                padding: '10px',
              }}
            >
              <AttributeCardGridView
                attributeBadge={attribute}
                sx={{
                  height: '100%',
                }}
              />
            </Box>
          ))}
        </>
      ) : (
        <>
          {defaultAttribute ? (
            <>
              <AttributeCardGridView
                attributeBadge={defaultAttribute}
                sx={{
                  padding: '10px',
                  height: '100%',
                }}
              />
            </>
          ) : (
            <>
              <Box
                sx={{
                  padding: '10px',
                }}
              >
                <Typography
                  variant="labelSmall"
                  sx={{
                    textWrap: 'nowrap',
                    color: 'white',
                  }}
                >
                  you have not selected any attributes yet
                </Typography>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};
