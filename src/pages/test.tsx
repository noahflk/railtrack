import { GetServerSideProps, NextPage } from 'next';
import { prisma } from '@/server/db/client';

const getTranslation = (locale: string) => {
  if (locale === 'de') return 'Hallo';
  if (locale === 'en') return 'Hi';

  return 'No translation found';
};

const Test: NextPage = () => <h1>Just testing mate</h1>;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = context.req.headers;

  console.log('aaaaa', headers['accept-language']);

  return {
    props: {}, // will be passed to the page component as props
  };
};

export default Test;
