'use client';
import {
  MainClientProvider,
  useMainClient,
} from '@/data/graphql/MainClientProvider';

export { useMainClient };
export default function GraphQLProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainClientProvider>{children}</MainClientProvider>;
}
