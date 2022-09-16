import NextLink from 'next/link';

type Props = {
  href: string;
  target?: string;
  children: React.ReactNode;
};

export const Link: React.FC<Props> = ({ href, target, children }) => (
  <NextLink href={href} passHref>
    <a target={target} className="font-medium text-primary hover:text-primary-light">
      {children}
    </a>
  </NextLink>
);
