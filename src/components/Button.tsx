import { classNames } from '@/utils/styling';

type Props = {
  type?: 'primary' | 'secondary';
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
};

export const Button: React.FC<Props> = ({ type, children, className, onClick }) => {
  if (type === 'secondary') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={classNames(
          '"inline-flex focus:ring-offset-2" items-center rounded-md border border-transparent bg-rose-100 px-3 py-2 text-sm font-medium leading-4 text-primary hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-primary',
          className ?? ''
        )}
      >
        {children}
      </button>
    );
  }

  // primary button
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'inline-flex items-center rounded-md border border-transparent bg-primary px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        className ?? ''
      )}
    >
      {children}
    </button>
  );
};
