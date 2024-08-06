'use client';
import { CommunityProfilePagePublic } from '@/data/graphql/models/CommunityProfilePagePublic';
import {
  ProfileEventName,
  logProfileEvent as logProfileEventAPICall,
} from '@/data/services/LogService';

const useLogProfileEvent = ({
  publicProfile,
}: {
  publicProfile: CommunityProfilePagePublic;
}) => {
  const logProfileEvent = async (
    eventName: ProfileEventName,
    eventData: Record<string, any>,
  ) => {
    logProfileEventAPICall({
      person_id: publicProfile.persona.personaId,
      user_handle: publicProfile.persona.userHandle,
      page_id: publicProfile.communityId,
      event_name: eventName,
      event_data: eventData,
    });
  };

  const logProfileView = async () => {
    logProfileEvent(ProfileEventName.profile_page_view, {});
  };

  const logProfileLinkClick = async (linkId: string) => {
    logProfileEvent(ProfileEventName.profile_page_link_click, { id: linkId });
  };

  const logProfileAttributeClick = async (pointId: string) => {
    logProfileEvent(ProfileEventName.profile_page_attribute_click, {
      id: pointId,
    });
  };

  const logProfileReferralClick = async (referralCode: string) => {
    logProfileEvent(ProfileEventName.profile_page_referral_click, {
      id: referralCode,
    });
  };

  // const logProfileWyrClick = async (wyrId: string) => {
  //     logProfileEvent(ProfileEventName.profile_page_wyr_click, { id: wyrId });
  // }

  return {
    // logProfileEvent,
    logProfileView,
    logProfileLinkClick,
    logProfileAttributeClick,
    logProfileReferralClick,
  };
};

export default useLogProfileEvent;
