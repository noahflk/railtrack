type Props = {
  className: string;
};

const Logo: React.FC<Props> = (props) => <img src="/images/logo.svg" alt="Railtrack logo" {...props} />;

export default Logo;
