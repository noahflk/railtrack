import type { NextPage } from 'next';

import Wrapper from '@/components/Wrapper';
import JourneySearchForm from '@/components/add-journey/JourneySearchForm';
import JourneySearchResults from '@/components/add-journey/JourneySearchResults';
import { protectedRoute } from '@/utils/protectedRoute';

const Add: NextPage = () => (
  <Wrapper title="Add journey">
    <ul role="list" className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <JourneySearchForm />
      <JourneySearchResults />
    </ul>
  </Wrapper>
);

export async function getServerSideProps({ req }) {
  return protectedRoute(req);
}

export default Add;
