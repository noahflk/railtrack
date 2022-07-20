import NextLink from 'next/link';

export const Link: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <NextLink href={href} passHref>
    <a className="font-medium text-primary hover:text-primary-light">{children}</a>
  </NextLink>
);

export const VanillaLink: React.FC<{ href: string; className: string; children: React.ReactNode }> = ({
  href,
  children,
  className,
}) => (
  <NextLink href={href} passHref>
    <a className={className}>{children}</a>
  </NextLink>
);
