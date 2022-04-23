type Props = {
  onClick?: () => void;
};

const TextButton: React.FC<Props> = ({ onClick, children }) => (
  <button onClick={onClick} className="font-medium text-primary hover:text-primary-light">
    {children}
  </button>
);

export default TextButton;
