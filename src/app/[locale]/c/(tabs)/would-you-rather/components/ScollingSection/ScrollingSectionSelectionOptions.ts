import { SelectionOption } from '@/components/SelectionSheet/BottomModalSelectionSheet.client';

// Top Bar
export enum MENU_OPTIONS {
  // SHARE = 'Share',
  SKIP = 'Skip',
  NEXT = 'Next',
  REPORT = 'Report',
}

export const SkipReasonOptions: SelectionOption[] = [
  {
    targetValue: 0,
    title: 'Neutral / No opinion',
  },
  {
    targetValue: 1,
    title: "I don't understand the question",
  },
  {
    targetValue: 2,
    title: 'Lacking Context / Poorly Designed',
  },
  {
    targetValue: 3,
    title: 'Religious and cultural conflict',
  },
];

export const ReportReasonOptions: SelectionOption[] = [
  {
    targetValue: 0,
    title: 'Offensive',
  },
  {
    targetValue: 1,
    title: 'Spam',
  },
  {
    targetValue: 2,
    title: 'Inappropriate',
  },
  {
    targetValue: 3,
    title: 'Other',
  },
];
