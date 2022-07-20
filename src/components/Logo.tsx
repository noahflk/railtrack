type Props = {
  className: string;
};

export const Logo: React.FC<Props> = (props) => <img src="/images/logo.svg" alt="Railtrack logo" {...props} />;
