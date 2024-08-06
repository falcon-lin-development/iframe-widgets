// Types
import { z } from 'zod';
import {
  OnBoardingFlowState,
  ProfileLinkInput,
} from '@/redux/features/flows/onBoardingSlice';
export type { OnBoardingFlowState, ProfileLinkInput };
import { createZodSchema } from '@/utils/createZodSchema';

export const ProfileLinkInputSchema = createZodSchema<ProfileLinkInput>()(
  z.object({
    title: z.string(),
    // @dev let this pass for simplicity
    url: z.string().url(),
    // url: z.string(),
  }),
);

export const OnBoardingFlowStateSchema = createZodSchema<OnBoardingFlowState>()(
  z.object({
    userName: z.string(),
    userHandle: z.string(),
    ei: z.enum(['E', 'I']).nullable(),
    sn: z.enum(['S', 'N']).nullable(),
    tf: z.enum(['T', 'F']).nullable(),
    jp: z.enum(['J', 'P']).nullable(),
    pronouns: z.string(),
    bio: z.string(),
    links: z.array(ProfileLinkInputSchema),
  }),
);
