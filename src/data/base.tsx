import axios from 'axios';

// Set up a base URL for your API
export const API_BASE_URL =
  process.env.API_URL || 'https://hephaestus.dttd.wtf';

const apiService = axios.create({
  baseURL: API_BASE_URL,

  // You can add more default configs here. For example:
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// Request interceptor
apiService.interceptors.request.use((request) => {
  if (request.url === '/analytics-tracking/log-event') {
    return request;
  }

  console.log(
    request.method,
    request.url,
    request.params,
    request.data,
    // JSON.stringify(request, null, 2)
  );
  return request;
});

// Response interceptor
// apiService.interceptors.response.use((response) => {
//   console.log(
//     'Response:',
//     response.config.url,
//     ':',
//     response.status,
//     // JSON.stringify(response, null, 2)
//   );
//   return response;
// });

export default apiService;
