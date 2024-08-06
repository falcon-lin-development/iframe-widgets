declare module 'js-cookie';
declare module 'redux-persist-cookie-storage';
declare module 'uuid';
declare module 'ua-parser-js';

// declare module '@microsoft/typescript-etw' {}
interface Window {
  // Define the gtag function signature
  gtag: (
    command: string,
    action: string,
    parameters: Record<string, unknown>,
  ) => void;
}
