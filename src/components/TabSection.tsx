'use client';
// External Libraries
import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Box,
  Tab,
  Tabs,
  Typography,
  SxProps,
  Theme,
} from '@mui/material';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { ButtonID } from '@/constants';

export const TabPanel: React.FC<{
  children?: React.ReactNode;
  index: number;
  value: number;
  tabSectionType: string;
}> = (props) => {
  const { children, value, index, tabSectionType, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${tabSectionType}-tabpanel-${index}`}
      aria-labelledby={`${tabSectionType}-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && children}
    </div>
  );
};

const TabSection: React.FC<{
  tabs: { label: string; content?: React.ReactNode }[];
  tabSectionType?: string;
  showContent?: boolean;
  valueState?: [number, React.Dispatch<React.SetStateAction<number>>];
  otherAttributes?: Record<string, any>;
  sx?: SxProps<Theme>;
}> = ({
  tabs,
  tabSectionType = 'simple',
  showContent = true,
  otherAttributes,
  valueState,
  sx,
}) => {
  const { logButtonClick } = useLogEvent();

  let [value, setValue] = React.useState(0);
  if (valueState) {
    [value, setValue] = valueState;
  }

  const a11yProps: (index: number) => {
    id: string;
    'aria-controls': string;
  } = (index) => {
    return {
      id: `${tabSectionType}-tab-${index}`,
      'aria-controls': `${tabSectionType}-tabpanel-${index}`,
    };
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={(event: React.SyntheticEvent, newValue: number) => {
          setValue(newValue);
        }}
        aria-label={`${tabSectionType}-tabs`}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        {...otherAttributes}
        sx={sx}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            {...a11yProps(index)}
            onClick={() => {
              logButtonClick(ButtonID.di.tabs, tab.label);
            }}
            sx={{
              fontFamily: 'Neue Metana',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px',
              letterSpacing: '0.1px',
              textAlign: 'center',
              minWidth: 'auto',
            }}
          />
        ))}
      </Tabs>
      {/* <div className="tw-pt-[4vh]" aria-label="spacer"></div> */}
      {showContent &&
        tabs.map((tab, index) => (
          <TabPanel
            key={index}
            value={value}
            index={index}
            tabSectionType={tabSectionType}
          >
            {tab.content}
          </TabPanel>
        ))}
    </>
  );
};

export default TabSection;
