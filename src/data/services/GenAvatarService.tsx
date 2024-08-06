//https://coh1c0iiff.execute-api.ap-southeast-1.amazonaws.com/Prod/t2i?mbtitype=INTP&gender=F
import axios, { AxiosResponse } from 'axios';
// {
//     "statusCode": 200,
//     "body": {
//         "status": "success",
//         "warning": "",
//         "id": null,
//         "generationTime": 1.95,
//         "output": [
//             "https://d313xg4mt2ic8m.cloudfront.net/generations/0-fdd98bcb-b986-4634-bda8-e8e531f842d6.png"
//         ],
//         "proxy_links": [
//             "https://d313xg4mt2ic8m.cloudfront.net/generations/0-fdd98bcb-b986-4634-bda8-e8e531f842d6.png"
//         ],
//         "nsfw_content_detected": false,
//         "webhook_status": "",
//         "meta": {
//             "prompt": "3d, blender, tinycore, toycore, sculpture, 1girl, female_focus, closed_mouth, closed_eyes, glasses, (gradient background:1.25), blue_hair, hat, olive",
//             "model_id": "rev-animated-v1",
//             "negative_prompt": "(bad and mutated hands),(worst quality :2.0),(low quality:2.0),(worst quality, low quality:1.4)",
//             "scheduler": "DPMSolverSinglestepScheduler",
//             "safety_checker": "no",
//             "W": 512,
//             "H": 512,
//             "guidance_scale": 7,
//             "seed": 522789853,
//             "steps": 30,
//             "n_samples": 1,
//             "full_url": "no",
//             "instant_response": "no",
//             "tomesd": "yes",
//             "ip_adapter": "yes",
//             "free_u": "no",
//             "upscale": "no",
//             "multi_lingual": "no",
//             "panorama": "no",
//             "self_attention": "no",
//             "use_karras_sigmas": "yes",
//             "algorithm_type": "no",
//             "safety_checker_type": "sensitive_content_text",
//             "embeddings": null,
//             "vae": null,
//             "lora": "3d-character",
//             "lora_strength": "1.0",
//             "clip_skip": 3,
//             "temp": "no",
//             "base64": "no",
//             "file_prefix": "fdd98bcb-b986-4634-bda8-e8e531f842d6.png"
//         }
//     },
//     "success": true
// }

export interface GenAvatarResponse {
  avatarUrl: string | undefined;
  //
  statusCode: number;
  body: {
    status: string;
    warning: string;
    id: null;
    generationTime: number;
    output: string[];
    proxy_links: string[];
    nsfw_content_detected: boolean;
    webhook_status: string;
    meta: {
      prompt: string;
      model_id: string;
      negative_prompt: string;
      scheduler: string;
      safety_checker: string;
      W: number;
      H: number;
      guidance_scale: number;
      seed: number;
      steps: number;
      n_samples: number;
      full_url: string;
      instant_response: string;
      tomesd: string;
      ip_adapter: string;
      free_u: string;
      upscale: string;
      multi_lingual: string;
      panorama: string;
      self_attention: string;
      use_karras_sigmas: string;
      algorithm_type: string;
      safety_checker_type: string;
      embeddings: null;
      vae: null;
      lora: string;
      lora_strength: string;
      clip_skip: number;
      temp: string;
      base64: string;
      file_prefix: string;
    };
  };
}

export type GenAvatarParams = {
  mbtiType: string;
  gender: string;
};

export const genAvatar: (
  props: GenAvatarParams,
) => Promise<GenAvatarResponse> = async ({ mbtiType, gender }) => {
  try {
    console.log('genAvatar api', 'mbtiType', mbtiType, 'gender', gender);
    const response: AxiosResponse = await axios.get(
      `https://coh1c0iiff.execute-api.ap-southeast-1.amazonaws.com/Prod/t2i`,
      {
        params: {
          mbtitype: mbtiType.trim(),
          gender: gender.trim(),
        },
      },
    );
    const _response: GenAvatarResponse = response.data;
    _response.avatarUrl = _response.body.output[0];
    return _response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
