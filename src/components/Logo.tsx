import Image from 'next/image';

import image from 'public/images/logo.svg';

export const Logo: React.FC<{
  className: string;
}> = (props) => <Image src={image} alt="Railtrack logo" {...props} />;
