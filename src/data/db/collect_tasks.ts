import { CHINESE_ZODIAC_TASK } from './tasks/chinesezodiac';
import { MBTI_TASK } from './tasks/mbti';
import { PRONOUNS_TASK } from './tasks/pronouns';
import { WESTERN_ZODIAC_TASK } from './tasks/westernzodiac';

export const DEFAULT_TASK_IMAGE_BG = `
radial-gradient(55.2% 93.78% at 12.83% 100%, rgba(157, 173, 255, 0.5) 0%, rgba(157, 173, 255, 0) 100%),
radial-gradient(48.66% 118.85% at 98.66% 98.57%, rgba(234, 89, 165, 0.25) 0%, rgba(234, 89, 165, 0) 100%),
radial-gradient(49.38% 84.27% at 72.46% 0%, rgba(255, 229, 123, 0.5) 0%, rgba(255, 229, 123, 0) 100%)
`;
export enum CollectionTaskType {
  single_test_task = 'single_test_task',
}

export enum CollectionTaskSubTaskType {
  url = 'url',
  surveyjs = 'surveyjs',
}

// export enum CollectionTaskSubTaskAction {
//     surveyjs = 'surveyjs',
// }

export type CollectionTask = {
  id: number | string;
  task_type: CollectionTaskType;

  // short view
  thumbnail: string;
  tag: string;
  short_description: string;
  start_time?: number;
  end_time?: number;
  is_live: boolean;

  // detail view
  banner: string;
  detail_tag: string;
  sub_tasks: CollectionSubTask[];
  full_description: string;

  // styling
  css?: {
    background?: string;
    [key: string]: any;
  };
};

export type CollectionSubTask = {
  sub_task_type: CollectionTaskSubTaskType;
  task_title: string;
  task_description: string;
  task_content: {
    [key: string]: any;
  };
};

export function isLive(task: CollectionTask) {
  /**
   * @dev
   * if not start_time and end_time, return isLive = true
   * if start_time and end_time and between start_time and end_time, return isLive = true, else false
   * if start_time and before start_time, return isLive = false, else true
   * if end_time and after end_time, return isLive = false, else true
   *
   */

  const now = Date.now();
  if (!task.start_time && !task.end_time) {
    return true;
  } else if (task.start_time && task.end_time) {
    return task.start_time <= now && task.end_time >= now;
  } else if (task.start_time) {
    return task.start_time <= now;
  } else if (task.end_time) {
    return task.end_time >= now;
  }
}

export const COLLECT_TASKS_MAP: Record<string, CollectionTask> = {
  [MBTI_TASK.id.toString()]: MBTI_TASK,
  [PRONOUNS_TASK.id.toString()]: PRONOUNS_TASK,
  [CHINESE_ZODIAC_TASK.id.toString()]: CHINESE_ZODIAC_TASK,
  [WESTERN_ZODIAC_TASK.id.toString()]: WESTERN_ZODIAC_TASK,
};
export const COLLECT_TASKS: CollectionTask[] = [
  MBTI_TASK,
  PRONOUNS_TASK,
  CHINESE_ZODIAC_TASK,
  WESTERN_ZODIAC_TASK,
];
