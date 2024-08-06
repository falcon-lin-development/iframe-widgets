import Page from '@/app/[locale]/c/page';
import Layout from '@/app/[locale]/c/layout';
import { Metadata, NextPage } from 'next';

type Props = {
  params: {
    locale: string;
  };
};

const Home: NextPage<Props> = async ({ params }) => {
  return (
    <Layout params={params}>
      <Page params={params} />
    </Layout>
  );
};
export default Home;
