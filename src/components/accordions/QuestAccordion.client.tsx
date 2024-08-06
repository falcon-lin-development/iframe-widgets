// Import necessary components and icons from MUI
'use client';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { ChevronDown } from 'lucide-react';
import colors from '@/styles/colors.config';
import { Avatar, Typography } from '@mui/material';

// Define the props if you have any. For this example, there are none.
type Props = {
  // communityQuestDetail: QuestDetail;
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: React.ReactNode;
  expanded?: boolean;
};

const QuestAccordion: React.FC<Props> = ({
  // communityQuestDetail
  id,
  icon,
  title,
  description,
  cta,
  expanded = false,
}) => {
  return (
    <>
      <Accordion
        defaultExpanded={expanded}
        // expanded={expanded}
        sx={{
          width: '100%',
          padding: '0px 12px 0px 12px',
          alignItems: 'center',
          borderRadius: '8px',
          boxShadow: 'none',
          border: '1px solid  #C5C7C8',
          '&::before': {
            content: 'none',
          },
          '& .MuiAccordionSummary-root': {
            padding: '0px',
          },
          '& .Mui-expanded': {
            margin: '0 !important',
          },
          '& .MuiAccordionDetails-root': {
            paddingBottom: '6px', // help balance the top and bottom padding
          },
        }}
        style={{
          margin: '0px',
        }}
      >
        <AccordionSummary
          expandIcon={<ChevronDown size={24} />}
          aria-controls={id + '-content'}
          id={id}
          sx={{
            alignItems: 'center',
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
            },
          }}
        >
          <Avatar
            sx={{
              // padding: '6px',
              height: '28px',
              width: '28px',
              backgroundColor: colors.primarySwatch.main[90],
            }}
          >
            {icon}
          </Avatar>
          <div className="tw-pl-[12px]" aria-label="spacer" />
          <Typography
            variant="titleMedium"
            color={colors.primarySwatch.main[40]}
            textAlign={'left'}
          >
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: '0px',
          }}
        >
          <Typography
            variant="bodyMedium"
            color={colors.neutralSwatch.main[10]}
          >
            {description}
          </Typography>
          <div className="tw-pt-[12px]" aria-label="spacer" />
          {cta}
          <div className="tw-pt-[12px]" aria-label="spacer" />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default QuestAccordion;
