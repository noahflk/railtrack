import type { GetServerSideProps, NextPage } from 'next';

import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { getLocaleProps } from '@/utils/locales';
import { useRouter } from 'next/router';

const Success: NextPage = () => {
  const router = useRouter();

  const { success } = router.query;

  return (
    <AuthWrapper type="verify">
      Check your email and click the link in the message to activate your account. {success} aaa
    </AuthWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return getLocaleProps(ctx);
};

export default Success;
