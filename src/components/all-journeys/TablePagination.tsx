import { RESULTS_PER_PAGE } from '@/constants';
import { VanillaLink } from '../Link';

type Props = {
  count: number;
  page: number;
};

const TablePagination: React.FC<Props> = ({ count, page }) => {
  const upperLimit = (page + 1) * RESULTS_PER_PAGE;
  const lowerLimit = upperLimit - RESULTS_PER_PAGE + 1;
  const isLastPage = (page + 1) * RESULTS_PER_PAGE === count;

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{lowerLimit}</span> - <span className="font-medium">{upperLimit}</span> of{' '}
          <span className="font-medium">{count}</span> results
        </p>
      </div>
      <div className="flex justify-between flex-1 sm:justify-end">
        {page > 0 && (
          <VanillaLink
            href={`/journeys/?page=${page - 1}`}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Previous
          </VanillaLink>
        )}
        {!isLastPage && (
          <VanillaLink
            href={`/journeys/?page=${page + 1}`}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Next
          </VanillaLink>
        )}
      </div>
    </nav>
  );
};

export default TablePagination;
