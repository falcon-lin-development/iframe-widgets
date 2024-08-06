import { CommunityInboxMessage } from '@/data/repositaries/CommunityInboxRepo';
import { NavigateOptions } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
export function inboxOnClick(
  inbox: CommunityInboxMessage,
  navigate: (pathTemplate: string, options?: NavigateOptions) => string | void,
) {
  if (
    inbox.custom_data.type === 'delusional-index' ||
    inbox.custom_data.type === 'delusion-index'
  ) {
    navigate(routes.c.inbox.delusion_index, {
      searchParams: {
        friend_name: inbox.custom_data.friend_name,
        i: inbox.custom_data.mbti.i,
        e: inbox.custom_data.mbti.e,
        n: inbox.custom_data.mbti.n,
        s: inbox.custom_data.mbti.s,
        t: inbox.custom_data.mbti.t,
        f: inbox.custom_data.mbti.f,
        j: inbox.custom_data.mbti.j,
        p: inbox.custom_data.mbti.p,
        score: inbox.custom_data.score,
      },
    });
  } else if (inbox.custom_data.type === 'personality-report') {
    navigate(routes.c.inbox.mootiez_report, {});
  }
}
