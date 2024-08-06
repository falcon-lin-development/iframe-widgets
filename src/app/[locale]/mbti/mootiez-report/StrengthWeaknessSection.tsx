import * as React from 'react';
import {
  capitalize,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import colors from '@/styles/colors.config';
import { Dot } from 'lucide-react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const StrengthWeaknessSection: React.FC<{
  fullReportJson: Record<string, any>;
}> = ({ fullReportJson }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
          <Tab label="Strengths" {...a11yProps(0)} />
          <Tab label="Weaknesses" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <div className="tw-pt-[4vh]" aria-label="spacer"></div>
      <CustomTabPanel value={value} index={0}>
        <List
          sx={{
            padding: 0,
            color: colors.neutralSwatch.main[10],
            '& .MuiListItem-root': {
              padding: 0,
              alignItems: 'start',
            },
            '& .MuiListItemIcon-root': {
              minWidth: 'auto',
            },
            '& .MuiListItemText-root': {
              fontFamily: 'Libre Franklin, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px',
              letterSpacing: '0.25px',
              textAlign: 'left',
              color: colors.neutralSwatch.main[10],
              '& .MuiTypography-root': {
                fontFamily: 'Libre Franklin, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
                letterSpacing: '0.25px',
                textAlign: 'left',
                color: colors.neutralSwatch.main[10],
              },
            },
          }}
        >
          {fullReportJson.Strengths &&
            (fullReportJson.Strengths as string[]).map((strength, index) => {
              return (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Dot size={24} style={{ paddingTop: '0.4rem' }} />
                  </ListItemIcon>
                  <ListItemText primary={capitalize(strength)} />
                </ListItem>
              );
            })}
        </List>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <List
          sx={{
            padding: 0,
            color: colors.neutralSwatch.main[10],
            '& .MuiListItem-root': {
              padding: 0,
              alignItems: 'start',
            },
            '& .MuiListItemIcon-root': {
              minWidth: 'auto',
            },
            '& .MuiListItemText-root': {
              fontFamily: 'Libre Franklin, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px',
              letterSpacing: '0.25px',
              textAlign: 'left',
              color: colors.neutralSwatch.main[10],
              '& .MuiTypography-root': {
                fontFamily: 'Libre Franklin, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
                letterSpacing: '0.25px',
                textAlign: 'left',
                color: colors.neutralSwatch.main[10],
              },
            },
          }}
        >
          {fullReportJson.Weaknesses &&
            (fullReportJson.Weaknesses as string[]).map((weakness, index) => {
              return (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Dot size={24} style={{ paddingTop: '0.4rem' }} />
                  </ListItemIcon>
                  <ListItemText primary={capitalize(weakness)} />
                </ListItem>
              );
            })}
        </List>
      </CustomTabPanel>
    </Box>
  );
};

export default StrengthWeaknessSection;
