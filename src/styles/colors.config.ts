const primaryBlueSwatch = {
  98: '#F3FAFF',
  95: '#DFF4FF',
  90: '#BAEAFF',
  80: '#5DD4FF',
  primary: '#03CAFC',
  70: '#00BAE8',
  60: '#009DC5',
  50: '#0081A2',
  40: '#006782',
  30: '#004D62',
  20: '#003545',
  10: '#001F29',
};
const secondaryBlueSwatch = {
  primary98: '#F3FAFF',
  primary95: '#DFF4FF',
  90: '#CFE6F1',
  80: '#B4CAD5',
  70: '#98AFB9',
  60: '#7E949E',
  50: '#657A84',
  40: '#4C616B',
  30: '#354A53',
  20: '#1E333C',
  10: '#071E26',
};
const neutralBlueSwatch = {
  98: '#F8F9FB',
  95: '#EFF1F3',
  90: '#E1E3E4',
  80: '#C5C7C8',
  70: '#A9ABAD',
  60: '#8F9193',
  50: '#757779',
  40: '#5C5F60',
  30: '#444749',
  20: '#2E3132',
  10: '#191C1E',
};

const primaryLilacSwatch = {
  98: '#FFF7FC',
  95: '#FDEBFF',
  90: '#F6D9FF',
  80: '#E8B3FF',
  primary: '#D095EC',
  70: '#D095EC',
  60: '#B37ACF',
  50: '#9861B3',
  40: '#7D4898',
  30: '#632F7E',
  20: '#4B1566',
  10: '#310049',
};
const secondaryLilacSwatch = {
  primary98: '#FFF7FC',
  primary95: '#FDEBFF',
  90: '#F1DCF5',
  80: '#D4C0D8',
  70: '#B8A5BC',
  60: '#9C8BA1',
  50: '#827187',
  40: '#68596E',
  30: '#504255',
  20: '#392C3E',
  10: '#231728',
};
const neutralLilacSwatch = {
  98: '#FFF7FC',
  95: '#F6EFF3',
  90: '#E8E0E5',
  80: '#CBC5C9',
  70: '#B0A9AE',
  60: '#958F93',
  50: '#7B767A',
  40: '#625D61',
  30: '#494549',
  20: '#332F33',
  10: '#1E1B1E',
};

const primaryLavenderSwatch = {
  98: '#FBF8FF',
  95: '#F0EFFF',
  90: '#DDE1FF',
  80: '#B9C3FF',
  primary: '#9DADFF',
  70: '#96A6F8',
  60: '#7C8CDB',
  50: '#6272BF',
  40: '#4959A5',
  30: '#30418B',
  20: '#162973',
  10: '#001257',
};
const secondaryLavenderSwatch = {
  primary98: '#FBF8FF',
  primary95: '#F0EFFF',
  90: '#DFE1F8',
  80: '#C3C5DB',
  70: '#A8AAC0',
  60: '#8D8FA4',
  50: '#73768A',
  40: '#5A5D70',
  30: '#434658',
  20: '#2C2F41',
  10: '#171B2B',
};

const neutralLavenderSwatch = {
  98: '#FBF8FD',
  95: '#F3F0F4',
  90: '#E4E1E6',
  80: '#C8C6CA',
  70: '#ACAAAE',
  60: '#919094',
  50: '#78767A',
  40: '#5F5E62',
  30: '#47464A',
  20: '#303033',
  10: '#1B1B1E',
};

const primarySwatch = {
  main: primaryLavenderSwatch,
  blue: primaryBlueSwatch,
  lilac: primaryLilacSwatch,
  lavender: primaryLavenderSwatch,
};
const secondarySwatch = {
  main: secondaryLavenderSwatch,
  blue: secondaryBlueSwatch,
  lilac: secondaryLilacSwatch,
  lavender: secondaryLavenderSwatch,
};

const neutralSwatch = {
  main: neutralLavenderSwatch,
  blue: neutralBlueSwatch,
  lilac: neutralLilacSwatch,
  lavender: neutralLavenderSwatch,
};

const primary = primarySwatch.main.primary;
const secondary = primary;
const white = '#FFFFFF';
const accentSuccess = '#3EE964';
const accentInfo = '#4971FF';
const accentWarning = '#FFC349';
const accentError = '#FF4949';

const colors = {
  // new
  primarySwatch,
  secondarySwatch,
  neutralSwatch,
  primary,
  secondary,
  white,
  accentSuccess,
  accentInfo,
  accentWarning,
  accentError,
  // colors
  // primaryBlue,
  // secondaryBlue,
  primaryGreen: '#70FC8F',
  toRGBA: (color: string, opacity: number) => {
    // Ensure hex is formatted properly
    const hex = color.replace('#', '');

    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Return the RGBA color format
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
};
export default colors;
