import type { GetServerSideProps, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { getLocaleProps } from '@/utils/locales';

const Verify: NextPage = () => {
  return (
    <AuthWrapper type="verify">
      Check your email and click the link in the message to activate your account.
    </AuthWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return getLocaleProps(ctx);
};

export default Verify;
