import { Metadata, ResolvingMetadata } from 'next';
import Logger from '@/components/common/Logger.client';
import { EventName } from '@/data/services/LogService';
import { executeGraphQL } from '@/app/api/executeGraphQL';
import { GET_COMMUNITY_PROFILE_PAGE_PUBLIC_BY_USER_HANDLE } from '@/data/graphql/models/CommunityProfilePagePublic';
import { GRAPHQL_API_ENDPOINT } from '@/app/api/create-public-profile/route';

interface Props {
  params: { userHandle: string };
  // searchParams: { [key: string]: string | string[] | undefined };
}
// export const metadata: Metadata = {
//   title: 'Mootiez Profile',
//   description: 'Mootiez Profile Page',
// };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const userHandle = params.userHandle;

  // fetch data
  // const product = await fetch(`https://.../${id}`).then((res) => res.json())
  const publicProfile = await executeGraphQL(GRAPHQL_API_ENDPOINT, {
    query: GET_COMMUNITY_PROFILE_PAGE_PUBLIC_BY_USER_HANDLE,
    variables: {
      userHandle: userHandle,
    },
    authToken: '',
  });
  // console.log('publicProfile', publicProfile);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  const previousTitle = (await parent).title || '';
  const previousDescription = (await parent).description || '';
  return {
    // title: product.title,
    title:
      publicProfile?.getCommunityProfilePagePublicByHandle?.persona
        ?.profileName ||
      'abc' ||
      previousTitle,
    description:
      publicProfile?.getCommunityProfilePagePublicByHandle?.persona
        ?.profileBio ||
      'bcd' ||
      previousDescription,
    openGraph: {
      // images: ['/some-specific-page-image.jpg', ...previousImages],
      // images: [
      // images: publicProfile.data?.getCommunityProfilePagePublicByHandle?.persona?.profileAvatarUrl || '',
      // ...previousImages
      // ],
      images: [
        {
          url:
            publicProfile?.getCommunityProfilePagePublicByHandle?.persona
              ?.profileAvatarUrl || '',
          width: 600,
          height: 600,
          alt: 'Og Image Alt',
        },
        ...previousImages,
      ],
    },
  };
}

type LayoutProps = {
  params: { locale: string };
  children: React.ReactNode;
  // searchParams: { [key: string]: string | string[] | undefined }
};
//@dev export a dummy layout that does nothing else
export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
