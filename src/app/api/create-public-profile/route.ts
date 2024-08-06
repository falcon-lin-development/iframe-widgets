// File: app/api/create-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
// API
import { API_PATH } from '@/data/graphql/clients';
// helpers
import { executeGraphQL } from '@/app/api/executeGraphQL';
import { checkAndExtractAuthToken } from '../checkAndExtractAuthToken';
import { getCountry } from 'countries-and-timezones';
// schema
import { z } from 'zod';
import {
  OnBoardingFlowState,
  OnBoardingFlowStateSchema,
  ProfileLinkInput,
} from '@/app/api/create-public-profile/requestSchema';
// queries
import {
  // 1)
  CREATE_PROFILE_QUERY,
  CreateProfileResponse,
  CREATE_PROFILE_MUTATION,

  // 2)
  UPDATE_PROFILE_URL_MUTATION,
  // 3)
  DROP_ATTRIBUTES_MUTATION,
  // 4)
  ADD_LINK_MUTATION,
  // 5)
  GET_USER_ATTRIBUTES_QUERY,
  GetPersonaCommunityBadgeBalancesResponse,
  UDPATE_PUBLIC_PROFILE_MUTATION,
  AddLinkResponse,
  REMOVE_LINKS_MUTATION,
} from '@/app/api/create-public-profile/responseSchema';
import { genAvatar } from '@/data/services/GenAvatarService';
import {
  NFT721MintingResponse,
  mintNFT721,
} from '@/data/services/MintNFTService';
import UAParser from 'ua-parser-js';

// Models
import { CommunityProfileLink } from '@/data/graphql/models/CommunityProfileLink/createCommunityProfileLink';
import { AuthenticationError, ValidationError } from '../errors';
import { UPDATE_PERSONA_USER_HANDLE } from '@/data/graphql/models/updateUserHandle';

export const GRAPHQL_API_ENDPOINT = API_PATH.main;

/**
 * This Endpoint create a new public profile
 * @param request
 * @returns
 * TODO:
 * 1) public profile update
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Request IP:', request.ip);
    const authToken = checkAndExtractAuthToken(request);
    const _data: OnBoardingFlowState = await request.json();
    const _query = new URL(request.url).searchParams;
    // GET http_referer, httpreferer, channel, referral_code, referralcode from query param
    const http_referer =
      _query.get('http_referer') || _query.get('httpreferer');
    const channel = _query.get('channel');
    const referral_code =
      _query.get('referral_code') || _query.get('referralcode');

    // @dev add https:// if not present
    for (const link of _data.links) {
      link.url = link.url.startsWith('http') ? link.url : `https://${link.url}`;
    }
    // return error if link > 10
    if (_data.links.length > 10) {
      throw new ValidationError('Links should be less than 10');
    }

    const _vData = OnBoardingFlowStateSchema.parse(_data);

    // Create the profile, i.e join the community
    const profile = await createProfile(
      _vData,
      {
        channel,
        http_referer,
        referral_code,
      },
      authToken,
    );
    const _userProfile = profile[0].getOrJoinCommunityProfile;
    const personaId = _userProfile.persona.personaId;

    // Generate Avatar
    const personalityType = _getPersonalityType(_vData);
    const pronouns = _vData.pronouns
      .toLocaleLowerCase()
      .replaceAll(':', '_')
      .replaceAll('/', '_');
    const avatarUrl = await safeGenAvatarAndMintNFT(authToken, {
      mbtiType: personalityType,
      gender: pronouns.startsWith('he')
        ? 'H'
        : pronouns.startsWith('she')
          ? 'S'
          : 'U',
    });
    // Update the profile url
    const updateProfile = await updateProfileUrl(avatarUrl, authToken);

    // Add links
    const links: AddLinkResponse[] = [];
    for (const link of _vData.links) {
      const addedLink = await addLink(link, authToken);
      links.push(addedLink);
    }

    // Drop Attributes for the user
    // const attributePromises: Promise<any>[] = [
    const attributes: Promise<any>[] = [
      await dropAttribute(authToken, {
        categoryType: 'mbti',
        categoryValue: personalityType.toLocaleLowerCase(),
      }),
      await dropAttribute(authToken, {
        categoryType: 'pronoun',
        categoryValue: pronouns,
      }),
    ];
    // const attributes = await Promise.all(attributePromises);

    // public profile add all Links, show first 2 attributes
    const publicProfile = await updatePublicProfileAttributesAndLinks(
      authToken,
      {
        links:
          links.length > 0
            ? links[links.length - 1]?.createCommunityProfileLink.reference
            : [],
      },
    );

    /**************************************************
     * after doing everything, call customer.io
     *  */
    const geo = request.geo;
    const countryCode =
      request.headers.get('cloudfront-viewer-country') || geo?.country; // This is typically the 2-letter country code
    const countryData = countryCode ? getCountry(countryCode) : null;
    // const geoData = {
    // country_code: request.headers.get('cloudFront-Viewer-Country') || null,
    // country_name: headers.get('CloudFront-Viewer-Country-Name') || null,
    // city: headers.get('CloudFront-Viewer-City') || null,
    // latitude: headers.get('CloudFront-Viewer-Latitude') || null,
    // longitude: headers.get('CloudFront-Viewer-Longitude') || null,
    // };
    // Parse the user agent
    const userAgent = request.headers.get('user-agent') || '';
    const parser = new UAParser(userAgent);
    const userAgentData = parser.getResult();
    // Get UTM parameters from the API request URL
    const utmSource = _query.get('utm_source');
    const utmMedium = _query.get('utm_medium');
    const utmCampaign = _query.get('utm_campaign');
    const utmTerm = _query.get('utm_term');
    const utmContent = _query.get('utm_content');

    // utm data
    const customerIOData = {
      email: _userProfile.persona.uniqueId || _userProfile.persona.unique_id,
      channel: channel || '-',
      http_referer: http_referer || '-',
      referral_code: referral_code || '-',
      gender: pronouns,
      mbti: personalityType,

      // locations
      locaton_ip: request.ip,
      location_country: countryCode || '-',
      location_region: request.geo?.region || '-',
      location_city: request.geo?.city || '-',
      location_longitude: request.geo?.longitude || '-',
      location_latitude: request.geo?.latitude || '-',
      // user agent
      user_agent_browser: userAgentData.browser.name || '-',
      user_agent_device: userAgentData.device.model || '-',
      user_agent_device_brand: userAgentData.device.vendor || '-',
      user_agent_is_mobile:
        userAgentData.device.type === 'mobile' ? 'true' : 'false',

      // utm
      utm_source: utmSource || '-',
      utm_medium: utmMedium || '-',
      utm_campaign: utmCampaign || '',
      utm_term: utmTerm || '-',
      utm_content: utmContent || '-',
    };

    const customerIOResult = await postCustomerIOForm(customerIOData).catch(
      (e) => {
        console.error('Error calling customer.io', e);
      },
    );

    return NextResponse.json({
      message: 'Profile created successfully',
      personaId: personaId,
      data: {
        createProfileResult: profile,
        generatedAvatarUrl: avatarUrl,
        updateProfileUrl: updateProfile,
        links,
        attributes,
        updatePublicProfile: publicProfile,
        customerIOResult,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return NextResponse.json(
        {
          error: 'Invalid data',
          details: error.errors,
        },
        { status: 400 },
      );
    } else if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation error', message: (error as Error).message },
        { status: error.status },
      );
    } else if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: 'Authentication error', message: (error as Error).message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', message: (error as Error).message },
      { status: 500 },
    );
  }
}

/****************************************************
 * Other functions
 *****************************************************/

// sub Methods
const _getPersonalityType = (
  input: Omit<OnBoardingFlowState, 'links' | 'bio' | 'pronouns'>,
) => {
  const personalityType =
    `${input.ei}${input.sn}${input.tf}${input.jp}`.replace(/null/g, '');
  return personalityType;
};

async function createProfile(
  input: Omit<OnBoardingFlowState, 'links'>,
  referral: {
    channel?: string | null;
    http_referer?: string | null;
    referral_code?: string | null;
  },
  authToken: string,
) {
  /**
   * create profile with params
   */

  const createResult: CreateProfileResponse = await executeGraphQL(
    GRAPHQL_API_ENDPOINT,
    {
      query: CREATE_PROFILE_QUERY,
      variables: {
        userName: input.userName,
        bio: input.bio,
        channel: referral.channel || '',
        httpReferer: referral.http_referer || '',
        referralCode: referral.referral_code || '',
      },
      authToken,
    },
  );
  /**
   * @dev check for authentication Error
   */
  if (
    createResult.getOrJoinCommunityProfile.error &&
    createResult.getOrJoinCommunityProfile.statusCode === 401
  ) {
    throw new AuthenticationError(
      createResult.getOrJoinCommunityProfile.message,
    );
  }

  /**
   * @dev check for creation error
   */
  if (!createResult.getOrJoinCommunityProfile.persona.personaId) {
    throw new Error('Error creating profile');
  }

  const updateUserHandleResult = await executeGraphQL(GRAPHQL_API_ENDPOINT, {
    query: UPDATE_PERSONA_USER_HANDLE,
    variables: {
      communityId: '1770071e-0000-0000-0000-1770071e7000',
      userHandle: input.userHandle,
    },
    authToken,
  });

  if (updateUserHandleResult.error || updateUserHandleResult.data?.error) {
    throw new Error('Error updating user handle');
  }

  /**
   * @dev remove all links if exists
   */
  let removeLinksResults = [];
  const removeLinksPromises = [];
  const _removeLink = (linkId: string) =>
    executeGraphQL(GRAPHQL_API_ENDPOINT, {
      query: REMOVE_LINKS_MUTATION,
      variables: {
        linkId: linkId,
      },
      authToken,
    });
  if (
    createResult?.getOrJoinCommunityProfile?.links &&
    createResult.getOrJoinCommunityProfile.links.length > 0
  ) {
    for (const link of createResult.getOrJoinCommunityProfile.links) {
      removeLinksPromises.push(_removeLink(link.id));
    }
    removeLinksResults = await Promise.all(removeLinksPromises);
  }

  const updateResult = await executeGraphQL(GRAPHQL_API_ENDPOINT, {
    query: CREATE_PROFILE_MUTATION,
    variables: {
      userName: input.userName,
      bio: input.bio,
      dataStore: {
        onboarding_flow_finished: true,
        onboarding_data: {
          pronouns: input.pronouns,
          personality_type: _getPersonalityType(input),
          ei: input.ei,
          sn: input.sn,
          tf: input.tf,
          jp: input.jp,
        },
      },
    },
    authToken,
  });

  return [
    createResult,
    updateUserHandleResult,
    {
      removeLinksResults,
    },
    updateResult,
  ];
}

const safeGenAvatarAndMintNFT = async (
  authToken: string,
  input: {
    mbtiType: string;
    gender: string;
  },
) => {
  const toBeRevealedImageKey = 'mootiez-to-be-revealed';
  let avatarUrl = '';
  try {
    const avatar = await genAvatar({
      mbtiType: input.mbtiType,
      gender: input.gender,
    });
    avatarUrl = avatar.avatarUrl || toBeRevealedImageKey;
  } catch (error) {
    avatarUrl = toBeRevealedImageKey;
    console.error('Unexpected error:', error);
  }

  /**
   * Async calls that's not dependent on each other
   */
  mintNFT721({
    accessToken: authToken,
    image_url: avatarUrl,
    mbti: input.mbtiType,
  })
    .then((response: NFT721MintingResponse) => {
      updateProfileUrl(response.image_url, authToken).catch((e) => {
        console.error('Error updating profile url after NFT', e);
      });
    })
    .catch((err) => {
      console.error('mintNFT721 error:', err);
    });

  return avatarUrl;
};

const updateProfileUrl = async (avatarUrl: string, authToken: string) => {
  const result = await executeGraphQL(GRAPHQL_API_ENDPOINT, {
    query: UPDATE_PROFILE_URL_MUTATION,
    variables: {
      url: avatarUrl,
    },
    authToken,
  });
  return result;
};

async function addLink(link: ProfileLinkInput, authToken: string) {
  const result = await executeGraphQL(GRAPHQL_API_ENDPOINT, {
    query: ADD_LINK_MUTATION,
    variables: {
      title: link.title,
      url: link.url,
    },
    authToken,
  });

  return result;
}

async function dropAttribute(
  authToken: string,
  input: {
    categoryType: string;
    categoryValue: string;
  },
) {
  /**
   * categoryType
   * categoryValue
   */
  try {
    const result = await executeGraphQL(GRAPHQL_API_ENDPOINT, {
      query: DROP_ATTRIBUTES_MUTATION,
      variables: {
        categoryType: input && input.categoryType,
        categoryValue: input && input.categoryValue.toLocaleLowerCase(),
      },
      authToken,
    });
    return result;
  } catch (e) {
    console.error('Error Dropping Attribute', e);
  }
}

const updatePublicProfileAttributesAndLinks = async (
  authToken: string,
  input: {
    links: CommunityProfileLink[];
  },
) => {
  // 1) get user attribute holding
  const userAttributes: GetPersonaCommunityBadgeBalancesResponse =
    await executeGraphQL(GRAPHQL_API_ENDPOINT, {
      query: GET_USER_ATTRIBUTES_QUERY,
      variables: {},
      authToken,
    });
  // 2) update user profile public page
  let _displayAttributes =
    userAttributes.getPersonaCommunityBadgeBalances?.holding || [];
  if (_displayAttributes.length < 2) {
    console.error('Error: User has less than 2 attributes');
    console.error(JSON.stringify(userAttributes));
  }

  _displayAttributes &&
    _displayAttributes.length > 2 &&
    (_displayAttributes = _displayAttributes.slice(0, 2));
  const updatePublicProfileResult = await executeGraphQL(GRAPHQL_API_ENDPOINT, {
    query: UDPATE_PUBLIC_PROFILE_MUTATION,
    variables: {
      designData: {
        links: input.links, // display all links
        attributes: _displayAttributes, // only show first 2 attributes
      },
    },
    authToken,
  });

  return [userAttributes, updatePublicProfileResult];
};

interface CustomerIOFormData {
  [key: string]: any;
}

const _getKeys = async () => {
  const customerIOSite = process.env.CUSTOMER_IO_SITE_ID;
  const customerIOApiKey = process.env.CUSTOMER_IO_API_KEY;
  const formId =
    process.env.ENV === 'prod' ? 'prodSurveyMBTIQuiz' : 'devSurveyMBTIQuiz';

  if (!customerIOSite) {
    console.error(`Error in postCustomerIOForm: customerIOSite is not defined`);
    throw new Error(
      `'customerIOSite is not defined'-${customerIOSite}-${customerIOApiKey}-${formId}`,
    );
  } else if (!customerIOApiKey) {
    console.error(
      `Error in postCustomerIOForm: customerIOApiKey is not defined.`,
    );
    throw new Error(
      `'customerIOApiKey is not defined'-${customerIOSite}-${customerIOApiKey}-${formId}`,
    );
  }

  return [customerIOSite, customerIOApiKey, formId];
};

async function postCustomerIOForm(
  //   customerIOSite: string,
  //   customerIOApiKey: string,
  // formId: string,
  data: CustomerIOFormData,
): Promise<[number, string]> {
  try {
    const [customerIOSite, customerIOApiKey, formId] = await _getKeys();

    const url = `https://track.customer.io/api/v1/forms/${formId}/submit`;
    const authKey = Buffer.from(
      `${customerIOSite}:${customerIOApiKey}`,
    ).toString('base64');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authKey}`,
    };

    const response = await axios.post(
      url,
      {
        data,
      },
      { headers },
    );

    if (response.status >= 300) {
      console.error(`Error in postCustomerIOForm: ${response.data}`);
      return [response.status, response.data];
    } else {
      return [response.status, 'done'];
    }
  } catch (error) {
    console.error(`Error in postCustomerIOForm: ${error}`);
    return [500, error instanceof Error ? error.message : String(error)];
  }
}
