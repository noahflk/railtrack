type Props = {
  onClick?: () => void;
  children: React.ReactNode;
};

export const TextButton: React.FC<Props> = ({ onClick, children }) => (
  <button onClick={onClick} className="font-medium text-primary hover:text-primary-light">
    {children}
  </button>
);
