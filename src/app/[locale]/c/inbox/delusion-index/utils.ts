export const getImageIndexFromDI: (di: number) => string = (di) => {
  if (0 < di && di <= 10) {
    return '0';
  } else if (10 < di && di <= 20) {
    // return "10"
    return '0';
  } else if (20 < di && di <= 30) {
    return '20';
  } else if (30 < di && di <= 40) {
    return '30';
  } else if (40 < di && di <= 50) {
    return '40';
  } else if (50 < di && di <= 60) {
    return '50';
  } else if (60 < di && di <= 70) {
    return '60';
  } else if (70 < di && di <= 80) {
    return '70';
  } else if (80 < di && di <= 90) {
    return '80';
  } else if (90 < di && di <= 100) {
    return '90';
  } else {
    return '0';
  }
};

export const getCopyWritingIndexFromDI: (di: number) => string = (di) => {
  if (0 < di && di <= 10) {
    return '0';
  } else if (10 < di && di <= 20) {
    // return "10"
    return '0';
  } else if (20 < di && di <= 30) {
    return '20';
  } else if (30 < di && di <= 40) {
    return '30';
  } else if (40 < di && di <= 50) {
    return '40';
  } else if (50 < di && di <= 60) {
    // return "50"
    return '40';
  } else if (60 < di && di <= 70) {
    return '60';
  } else if (70 < di && di <= 80) {
    return '60';
  } else if (80 < di && di <= 90) {
    return '80';
  } else if (90 < di && di <= 100) {
    return '90';
  } else {
    return '0';
  }
};

const diColors = {
  0: '#8CDCF4',
  10: '#96CFEC',
  20: '#9FC1E4',
  30: '#AAB3DB',
  40: '#B4A5D3',
  50: '#BD98CB',
  60: '#C789C2',
  70: '#D17CBA',
  80: '#DB6DB1',
  90: '#E460A9',
  100: '#E460A9',
};
export const getColorCodeFromDI: (di: number) => string = (di) => {
  if (0 < di && di <= 10) {
    return diColors[0];
  } else if (10 < di && di <= 20) {
    return diColors[10];
  } else if (20 < di && di <= 30) {
    return diColors[20];
  } else if (30 < di && di <= 40) {
    return diColors[30];
  } else if (40 < di && di <= 50) {
    return diColors[40];
  } else if (50 < di && di <= 60) {
    return diColors[50];
  } else if (60 < di && di <= 70) {
    return diColors[60];
  } else if (70 < di && di <= 80) {
    return diColors[70];
  } else if (80 < di && di <= 90) {
    return diColors[80];
  } else if (90 < di && di <= 100) {
    return diColors[90];
  } else {
    return '#FFD700';
  }
};
