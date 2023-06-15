import { LoadingSpinner } from '@/components/LoadingSpinner';
import { classNames } from '@/utils/styling';

type Props = {
  type?: 'primary' | 'secondary' | 'text';
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isLoading?: boolean;
  children: React.ReactNode;
};

export const Button: React.FC<Props> = ({ type, children, className, onClick, isLoading }) => {
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
        {/* invisible means text remains hidden in the background to preserve the button width */}
        <span className={isLoading ? 'invisible' : undefined}>{children}</span>
        {isLoading && <LoadingSpinner className="absolute" />}
      </button>
    );
  }

  if (type === 'text') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={classNames(
          'text-small inline-flex items-center justify-center font-medium text-primary hover:text-primary-light',
          className ?? ''
        )}
      >
        {/* invisible means text remains hidden in the background to preserve the button width */}
        <span className={isLoading ? 'invisible' : undefined}>{children}</span>
        {isLoading && <LoadingSpinner className="absolute" />}
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
      {/* invisible means text remains hidden in the background to preserve the button width */}
      <span className={isLoading ? 'invisible' : undefined}>{children}</span>
      {isLoading && <LoadingSpinner className="absolute" />}
    </button>
  );
};
