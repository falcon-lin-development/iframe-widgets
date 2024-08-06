// POST https://jyopsgqvqd.execute-api.ap-southeast-1.amazonaws.com/mootiez/airdrop-nft

import axios, { AxiosResponse } from 'axios';

/**
 * 
 * @param parameters 
 * @returns 
 * {
    "chain_id": 11155111,
    "tx_hash": "0x31d2fad78cbbabbd11e5d2c8ce6eb14b455f58f237baf22ea4c52aa9382cb8f1",
    "contract_address": "0xC3d14cdf4f297a4D0B1E668D1414C212d972b9f0",
    "token_id": "340967537150638475241189",
    "image_url": "https://doritos-public-bucket-dev.s3.ap-southeast-1.amazonaws.com/mootiez/airdrop/340967537150638475241189.png"
    }
 */

export interface NFT721MintingResponse {
  chain_id: number;
  tx_hash: string;
  contract_address: string;
  token_id: string;
  image_url: string;
}

async function generatePayloadSignature(parametersStr: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(parametersStr);

  // Generate the SHA-256 hash of the data
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert the ArrayBuffer to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const payloadSignature = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return payloadSignature;
}

export const mintNFT721: (props: {
  accessToken: string;
  image_url: string;
  mbti: string;
}) => Promise<NFT721MintingResponse> = async ({
  accessToken,
  image_url,
  mbti,
}) => {
  const parameters = {
    image_key: image_url
      .replace('https://d313xg4mt2ic8m.cloudfront.net/generations/', '')
      .replace('.png', ''),
    mbti: mbti,
    timestamp: `${Date.now()}`,
  };
  const parametersStr = JSON.stringify(parameters);
  try {
    console.log('mintNFT721 parameters:', parametersStr);
    const response: AxiosResponse = await axios.post(
      process.env.MINT721_API_URL ||
        `https://jyopsgqvqd.execute-api.ap-southeast-1.amazonaws.com/mootiez/airdrop-nft`,
      {
        parameters: parametersStr,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'payload-signature': await generatePayloadSignature(parametersStr),
        },
      },
    );
    const _response: NFT721MintingResponse = response.data;
    return _response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('axios error:', error.response);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
