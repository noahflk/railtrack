import { DocumentSearchIcon } from '@heroicons/react/outline';

import { Link } from '@/components//Link';

export const EmptyJourneyNotice: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full pb-8 space-y-2">
    <DocumentSearchIcon className="w-20 " />
    <p className="text-lg font-medium">No journeys yet!</p>
    <Link href="/add">Add new journey</Link>
  </div>
);
