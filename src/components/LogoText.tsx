type Props = {
  className: string;
};

const LogoText: React.FC<Props> = (props) => <img src="/logo-text.svg" alt="Railtrack logo with text" {...props} />;

export default LogoText;
