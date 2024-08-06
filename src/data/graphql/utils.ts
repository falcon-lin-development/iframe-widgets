// import {
//   createClient,
//   cacheExchange,
//   fetchExchange,
//   subscriptionExchange,
// } from 'urql';
// import { SubscriptionClient } from 'subscriptions-transport-ws';

// const domain = 'hephaestus.dttd.wtf';
// const subscriptionClient = new SubscriptionClient(
//   `wss://${domain}/api/v1/graphql`,
//   {
//     reconnect: true,
//     lazy: true,
//   },
// );

// export const urqlClient = createClient({
//   url: `https://${domain}/api/v1/graphql`,
//   exchanges: [
//     subscriptionExchange({
//       forwardSubscription: (operation) => subscriptionClient.request(operation),
//     }),
//     cacheExchange,
//     fetchExchange,
//   ],
// });
