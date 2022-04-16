type Props = {
  className: string;
};

const Logo: React.FC<Props> = (props) => <img src="/logo.svg" alt="Railtrack logo" {...props} />;

export default Logo;
