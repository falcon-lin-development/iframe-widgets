'use client';
import BottomNavbar, {
  NavBarIconButton,
} from '@/components/navbars/BottomNavBar.client';
import Image from 'next/image';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import {
  ScrollText,
  Gift,
  User,
  Compass,
  BookOpenCheck,
  Gamepad,
  Star,
  LucideMessagesSquare,
  StarIcon,
} from 'lucide-react';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import assets, { ButtonID } from '@/constants';
import { Avatar, Box, capitalize } from '@mui/material';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import colors from '@/styles/colors.config';

type Prop = {
  showText?: boolean;
  communityProfile: CommunityProfile;

  sx?: React.CSSProperties;
};

const CommunityNavBar: React.FC<Prop> = ({
  showText = true,
  sx,
  communityProfile,
}) => {
  const { isCurrentPath, navigate, constructPath } = useAppRouting();
  const { logButtonClick } = useLogEvent();

  const profileIcon = (
    <Avatar
      src={
        communityProfile.profile_avatar_url === ''
          ? assets.images.app.defaultAvatar
          : communityProfile.profile_avatar_url
      }
      alt="community profile avatar"
      sx={{
        width: '20px',
        height: '20px',
        cursor: 'pointer',
      }}
    />
  );

  const profileNameRepr =
    communityProfile.profile_name.length > 10
      ? communityProfile.profile_name.substring(0, 10) + '...'
      : communityProfile.profile_name || 'profile';

  return (
    <BottomNavbar sx={sx}>
      <NavBarIconButton
        id="bottom-nav-btn-explore"
        data-gtm="bottom-nav-btn-explore"
        name={capitalize('explore')}
        icon={<Compass size={24} />}
        focusIcon={<Compass size={24} />}
        active={
          // routes.none points to quest page
          isCurrentPath(routes.none) ||
          isCurrentPath(routes.c.journeys._home) ||
          isCurrentPath(routes.c._home)
        }
        onClick={() => {
          logButtonClick(ButtonID.appbar.quest, '');
          // navigate(routes.c.journeys._home);
        }}
        href={constructPath(routes.c.journeys._home)}
        showText={showText}
      />
      <NavBarIconButton
        id="bottom-nav-btn-quizzes"
        data-gtm="bottom-nav-btn-quizzes"
        name={capitalize('collect')}
        icon={<StarIcon size={24} />}
        focusIcon={<StarIcon size={24} />}
        active={isCurrentPath(routes.c.quizzes._home)}
        onClick={() => {
          logButtonClick(ButtonID.appbar.would_you_rather, '');
        }}
        href={constructPath(routes.c.quizzes._home)}
        showText={showText}
      />
      <NavBarIconButton
        id="bottom-nav-btn-would-you-rather"
        data-gtm="bottom-nav-btn-would-you-rather"
        name={capitalize('social')}
        icon={<LucideMessagesSquare size={24} />}
        focusIcon={<LucideMessagesSquare size={24} />}
        active={isCurrentPath(routes.c.would_you_rather._home)}
        onClick={() => {
          logButtonClick(ButtonID.appbar.would_you_rather, '');
          // navigate(routes.c.journeys._home);
        }}
        href={constructPath(routes.c.would_you_rather._home)}
        showText={showText}
      />

      <NavBarIconButton
        id="bottom-nav-btn-profile"
        data-gtm="bottom-nav-btn-profile"
        name={profileNameRepr}
        icon={profileIcon}
        focusIcon={profileIcon}
        active={isCurrentPath(routes.c.profile._home)}
        onClick={() => {
          logButtonClick(ButtonID.appbar.profile, '');
          // navigate(routes.c.profile._home);
        }}
        href={constructPath(routes.c.profile._home)}
        showText={showText}
      />
    </BottomNavbar>
  );
};

export default CommunityNavBar;
