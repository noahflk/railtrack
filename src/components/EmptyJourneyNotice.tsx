import { DocumentSearchIcon } from '@heroicons/react/outline';

import { Link } from '@/components//Link';

export const EmptyJourneyNotice: React.FC = () => (
  <div className="flex h-full flex-col items-center justify-center space-y-2 pb-8">
    <DocumentSearchIcon className="w-20 " />
    <p className="text-lg font-medium">No journeys yet!</p>
    <Link href="/add">Add new journey</Link>
  </div>
);
