import routes from '@/routes/routes';
import {
  CollectionTask,
  CollectionTaskSubTaskType,
  CollectionTaskType,
} from '@/data/db/collect_tasks';
import assets from '@/constants';

export const PRONOUNS_TASK: CollectionTask = {
  id: 'pronouns',
  task_type: 'single_test_task' as CollectionTaskType,

  // short view
  thumbnail: assets.tasks.mbti_test.pronouns_banner,
  tag: 'Pronouns',
  short_description: 'Be proud! Let others know how you identify.',
  is_live: true,

  // detail view
  banner: assets.tasks.mbti_test.pronouns_banner,
  detail_tag: 'Pronouns',
  sub_tasks: [
    {
      sub_task_type: 'url' as CollectionTaskSubTaskType,
      task_title: 'Tell us your identity',
      task_description: 'Takes 1 min',
      task_content: {
        target_url: routes.c.quizzes.tasks.pronouns._home,
      },
    },
  ],
  full_description: `
      A pronoun is a word that stands in for a noun, 
      often to avoid the need to repeat the same noun over and over. 
      Like nouns, pronouns can refer to people, things, 
      concepts, and places.
    `,
};
