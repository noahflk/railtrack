import type { GetServerSideProps, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { Link } from '@/components/Link';
import { getLocaleProps } from '@/utils/locales';

const Success: NextPage = () => (
  <AuthWrapper type="success">
    <Link href="/dashboard">Go to your dashboard</Link>
  </AuthWrapper>
);

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return getLocaleProps(ctx);
};

export default Success;
