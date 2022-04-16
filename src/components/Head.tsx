import NextHead from 'next/head';

type Props = {
  title?: string;
};

const Head: React.FC<Props> = ({ title }) => (
  <NextHead>
    <title>
      {title ? `${title} - ` : ''}
      {process.env.NEXT_PUBLIC_APP_NAME}
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </NextHead>
);

export default Head;
