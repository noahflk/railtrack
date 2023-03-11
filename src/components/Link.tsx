import NextLink from 'next/link';

import { classNames } from '@/utils/styling';

type Props = {
  href: string;
  target?: string;
  children: React.ReactNode;
  className?: string;
};

export const Link: React.FC<Props> = ({ href, target, children, className }) => (
  <NextLink
    href={href}
    passHref
    target={target}
    className={classNames('font-medium text-primary hover:text-primary-light', className ?? '')}
  >
    {children}
  </NextLink>
);
