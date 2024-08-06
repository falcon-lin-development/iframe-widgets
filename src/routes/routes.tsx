import flattenRoutes from './flattenRoutesUtils';

const routes = {
  none: '/',
  _home: '/',
  _home_login: '/',
  auth: {
    login: '/auth/login',
    google: {
      callback: '/auth/google/callback',
    },
    magiclink: {
      waiting: '/auth/magiclink/waiting',
    },
  },
  mbti: {
    _home: 'mbti',
    get_my_mootiez: '/mbti/get-my-mootiez',
    mootiez_report: '/mbti/mootiez-report',
  },
  c: {
    _home: '/c',
    join: '/c/join',
    flow: {
      onboarding: {
        _home: '/c/flow/onboarding',
      },
    },
    flows: {
      _home: '/c/flows',
      flowId: {
        stepId: {
          _home: '/c/flows/:flowId/:stepId',
        },
      },
    },
    journeys: {
      _home: '/c/journeys',
      detail: {
        survery: '/c/journeys/:questId/survey',
        typeform: '/c/journeys/:questId/typeform',
        _home: '/c/journeys/:questId',
      },
    },
    quizzes: {
      _home: '/c/quizzes',
      detail: {
        _home: '/c/quizzes/:qid',
      },
      tasks: {
        mbti_test: {
          _home: '/c/quizzes/tasks/mbti-test',
          survey: '/c/quizzes/tasks/mbti-test/survey',
        },
        pronouns: {
          _home: '/c/quizzes/tasks/pronouns',
        },
        chinese_zodiac: {
          _home: '/c/quizzes/tasks/chinese-zodiac',
        },
        western_zodiac: {
          _home: '/c/quizzes/tasks/western-zodiac',
        },
      },
    },
    would_you_rather: {
      _home: '/c/would-you-rather',
      detail: {
        _home: '/c/would-you-rather/:qid',
        comment: {
          _home: '/c/would-you-rather/:qid/:encodedCommentId',
        },
      },
      random: '/c/would-you-rather/random',
    },
    profile: {
      _home: '/c/profile',
      attributes: {
        _home: '/c/profile/attributes',
      },
      // edit_username: '/c/profile/edit-username',
      edit_profile: {
        _home: '/c/profile/edit-profile',
      },
      profile_page_customization: {
        _home: '/c/profile/profile-page-customization',
      },
      stickers: {
        _home: '/c/profile/stickers',
        create: '/c/profile/stickers/create',
        detail: {
          _home: '/c/profile/stickers/:stickerId',
        },
      },
      v: {
        // v for view
        public: {
          // _home: '/c/profile/v/public',
          userHandle: '/c/profile/v/public/:userHandle',
          // personaId: '/c/profile/v/public/:personaId',
        },
        default: {
          // _home: '/c/profile/v/default',
          personaId: '/c/profile/v/default/:personaId',
        },
        me: {
          _home: '/c/profile/v/me',
        },
      },
    },
    inbox: {
      _home: '/c/inbox',
      detail: {
        _home: '/c/inbox/:inboxId',
      },
      mootiez_report: '/c/inbox/mootiez-report',
      delusion_index: '/c/inbox/delusion-index',
    },
    chat: {
      _home: '/c/chat',
      bot: {
        new_chat: '/c/chat/bot',
        // chat: '/c/chat/g/:chatId',
        guest_chat: '/c/chat/bot/guest/:chatId',
      },
    },
  },
};
routes._home = routes.c._home;
routes._home_login = routes.auth.login;

/**
 * General Auth -- implies --> Community Auth
 */
// this routes are specific to community protected features
const _communityProtectedRoutes = [routes.none, ...flattenRoutes(routes.c)];

// this routes are protected through general auth
const _protectedRoutes = [
  ..._communityProtectedRoutes,
  routes.mbti.get_my_mootiez,
  routes.mbti.mootiez_report,
];

/**
 * Negative of protected routes
 */
const _unProtectedRoutes = [
  ...flattenRoutes(routes.auth),
  routes.c.join,
  // routes.c.chat.bot.new_chat,
  // routes.c.chat.bot.guest_chat,
  routes.mbti._home,

  /** @dev WTR detail page is publicly sharable */
  routes.c.would_you_rather.detail._home,
  /** @dev public profile is publicly sharable */
  // routes.c.profile.v.public._home,
  routes.c.profile.v.public.userHandle,
  routes.c.profile.v.default.personaId,
  // routes.c.profile.v.public.personaId,
];

const _communityUnProtectedRoutes = [
  ..._unProtectedRoutes,
  routes.c.flows.flowId.stepId._home,
  routes.c.flow.onboarding._home,
];

/**
 * Protected Routes Results
 */
const protectedRoutes = _protectedRoutes.filter(
  (route) => !_unProtectedRoutes.includes(route),
);

const communityProtectedRoutes = _communityProtectedRoutes.filter(
  (route) => !_communityUnProtectedRoutes.includes(route),
);

export { protectedRoutes, communityProtectedRoutes };

export default routes;
