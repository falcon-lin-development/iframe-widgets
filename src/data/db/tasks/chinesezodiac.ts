import routes from '@/routes/routes';
import {
  CollectionTask,
  CollectionTaskSubTaskType,
  CollectionTaskType,
} from '@/data/db/collect_tasks';
import assets from '@/constants';

export const CHINESE_ZODIAC_TASK: CollectionTask = {
  id: 'chinesezodiac',
  task_type: 'single_test_task' as CollectionTaskType,

  // short view
  thumbnail: assets.tasks.chinese_zodiac.banner,
  tag: 'Chinese Zodiac',
  short_description: 'Find out your Chinese zodiac now!',
  is_live: true,

  // detail view
  banner: assets.tasks.chinese_zodiac.banner,
  detail_tag: 'Chinese Zodiac',
  sub_tasks: [
    {
      sub_task_type: 'url' as CollectionTaskSubTaskType,
      task_title: 'When is your birthday?',
      task_description: 'Takes 1 min',
      task_content: {
        target_url: routes.c.quizzes.tasks.chinese_zodiac._home,
      },
    },
  ],
  full_description: `
      Chinese zodiac, or shengxiao (/shnng-sshyao/ 'born resembling'), 
      is represented by 12 zodiac animals. In order, they are the Rat, Ox, 
      Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig.
      \n
      Chinese zodiac years begin/end at Chinese New Year (in January/February). 
      Each year in the repeating zodiac cycle of 12 years is represented by a zodiac 
      animal, each with its own reputed attributes.
    `,
};
