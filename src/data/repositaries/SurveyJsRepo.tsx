// GET /api/v1/public/survey
// POST /api/v1/public/submit-survey
// POST /api/v1/client/survey/update-survey-response
// POST https://jyopsgqvqd.execute-api.ap-southeast-1.amazonaws.com/mootiez/submit-mbti-form
import apiService from '../base';
import axios, { AxiosResponse } from 'axios';
/**
 * {
  "form_id": "mootiez-main-mbti",
  "title": "Mootiez Main MBTI Test",
  "questions": {}
  "custom_fields": {},
  "definitions": {},
  "created_at": 1711425208000,
  "created_by": "dotted",
  "updated_at": 1711425208000,
  "updated_by": "dotted"
}
 * 
 */

export interface Survey {
  form_id: string;
  title: string;
  questions: Record<string, any>;
  custom_fields: Record<string, any>;
  definitions: Record<string, any>;
  created_at: number;
  created_by: string;
  updated_at: number;
  updated_by: string;
}

export const getSurvey = async ({
  formId,
}: {
  formId: string;
}): Promise<Survey> => {
  try {
    const response: AxiosResponse = await apiService.get(
      `/api/v1/public/survey`,
      {
        params: {
          form_id: formId.trim(),
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const submitSurvey = async ({
  formId,
  formSessionId,
  resposne,
  persona_id,
  communityId,
  trackingData,
}: {
  formId: string;
  formSessionId: string;
  resposne: Record<string, any>;
  persona_id: string;
  communityId: string;
  trackingData: Record<string, any>;
}): Promise<boolean> => {
  try {
    console.log('submitSurvey', {
      formId,
      formSessionId,
      resposne,
      persona_id,
      communityId,
      trackingData,
    });
    const response: AxiosResponse = await apiService.post(
      `/api/v1/public/submit-survey`,
      {
        form_id: formId,
        form_session_id: formSessionId,
        response: resposne,
        persona_id,
        community_id: communityId,
        tracking_data: trackingData,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const udpateSurveyResposnePersona = async ({
  accessToken,
  formSessionId,
}: {
  accessToken: string;
  formSessionId: string;
}): Promise<boolean> => {
  try {
    console.log('udpateSurveyResposnePersona');
    const response: AxiosResponse = await apiService.post(
      `/api/v1/client/survey/update-survey-response`,
      {
        form_session_id: formSessionId, // form_session_id is just a checksum
      },
      {
        headers: {
          authorization: 'Bearer ' + accessToken.trim(),
        },
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
//

export const customerIOMainMBTI = async ({
  formSessionId,
}: {
  formSessionId: string;
}) => {
  try {
    console.log('customerIOMainMBTI');
    const response: AxiosResponse = await apiService.post(
      process.env.ENV == 'prod'
        ? `https://gwpkww9srj.execute-api.ap-southeast-1.amazonaws.com/mootiez/submit-mbti-form`
        : `https://jyopsgqvqd.execute-api.ap-southeast-1.amazonaws.com/mootiez/submit-mbti-form`,
      {
        form_session_id: formSessionId,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
