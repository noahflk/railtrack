import Wrapper from '@/components/Wrapper';
import JourneyList from '@/components/all-journeys/JourneyList';
import { protectedRoute } from '@/utils/protectedRoute';

const Journeys: React.FC = () => {
  return (
    <Wrapper title="Journeys">
      <JourneyList />
    </Wrapper>
  );
};

export async function getServerSideProps({ req }) {
  return protectedRoute(req);
}

export default Journeys;
