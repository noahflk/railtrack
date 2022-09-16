import type { GetServerSideProps, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { Link } from '@/components/Link';
import { protectedAuthWithLocales } from '@/utils/protectedLocales';

const Success: NextPage = () => (
  <AuthWrapper type="success">
    <Link href="/dashboard">Go to your dashboard</Link>
  </AuthWrapper>
);

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return protectedAuthWithLocales(ctx);
};

export default Success;
