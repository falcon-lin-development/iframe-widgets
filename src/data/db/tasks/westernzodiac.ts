import routes from '@/routes/routes';
import {
  CollectionTask,
  CollectionTaskSubTaskType,
  CollectionTaskType,
} from '@/data/db/collect_tasks';
import assets from '@/constants';

export const WESTERN_ZODIAC_TASK: CollectionTask = {
  id: 'westernzodiac',
  task_type: 'single_test_task' as CollectionTaskType,

  // short view
  thumbnail: assets.tasks.western_zodiac.banner,
  tag: 'Western Zodiac',
  short_description: 'Get your western zodiac attribute.',
  is_live: true,

  // detail view
  banner: assets.tasks.western_zodiac.banner,
  detail_tag: 'Western Zodiac',
  sub_tasks: [
    {
      sub_task_type: 'url' as CollectionTaskSubTaskType,
      task_title: 'When is your birthday?',
      task_description: 'Takes 1 min',
      task_content: {
        target_url: routes.c.quizzes.tasks.western_zodiac._home,
      },
    },
  ],
  full_description: `
    Western Zodiac, a belt around the sky extending 9° on either side of the ecliptic, 
    the Sun’s apparent annual path, which contains 12 constellations or astrological signs. 
    In astrology, the outcome of an event (most notably, someone’s birth) is affected by the zodiacal 
    positions of the Sun, the Moon, and the planets when that event happened. The orbits of the 
    Moon and of the naked-eye planets also lie entirely within the zodiac.
  `,
};
