import NextLink from "next/link";

type Props = {
  href: string;
};

const Link: React.FC<Props> = ({ href, children }) => (
  <NextLink href={href} passHref>
    <a className="font-medium text-primary hover:text-primary-light">{children}</a>
  </NextLink>
);

export default Link;
