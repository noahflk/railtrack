import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Head } from '@/components/Head';
import { Link } from '@/components/Link';
import { Logo } from '@/components/Logo';
import image from 'public/images/symbolic-1.jpg';

type AuthType = 'signin' | 'signup' | 'forgot' | 'set' | 'verify' | 'success';

type Props = {
  type: AuthType;
  children: React.ReactNode;
};

const AlternativeLink: React.FC<{ type: AuthType }> = ({ type }) => {
  const t = useTranslations('auth');

  const signInTitle = t('signInTitle')[0]?.toLowerCase() + t('signInTitle').substring(1);
  const signUpTitle = t('signUpTitle')[0]?.toLowerCase() + t('signUpTitle').substring(1);

  if (type === 'signup') return <Link href="/signin">{signInTitle}</Link>;

  return <Link href="/signup">{signUpTitle}</Link>;
};

const authTypeToText = (type: AuthType): string => {
  if (type === 'signin') return 'SignIn';
  if (type === 'signup') return 'SignUp';
  if (type === 'verify') return 'Verify email';
  if (type === 'success') return 'Email verified';
  if (type === 'set') return 'Set new password';

  return 'Forgot password';
};

export const AuthWrapper: React.FC<Props> = ({ children, type }) => {
  const t = useTranslations('auth');

  return (
    <>
      <Head title={authTypeToText(type)} />
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Logo className="h-12 w-auto" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {type === 'signup' && t('signUpTitle')}
                {type === 'signin' && t('signInTitle')}
                {type === 'forgot' && t('forgotTitle')}
                {type === 'verify' && t('verifyTitle')}
                {type === 'success' && t('verifySuccessTitle')}
                {type === 'set' && t('setTitle')}
              </h2>
              {['signup', 'signin'].includes(type) && (
                <p className="mt-2 text-sm">
                  {t('or')} <AlternativeLink type={type} />
                </p>
              )}
            </div>

            <div className="mt-8">
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image className="absolute inset-0 h-full w-full object-cover" src={image} alt="Symbolic train image" />
        </div>
      </div>
    </>
  );
};
