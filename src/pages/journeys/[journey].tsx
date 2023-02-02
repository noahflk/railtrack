import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const JourneyView: NextPage = () => {
  const router = useRouter();
  const { journey } = router.query;

  return <p>Journey: {journey}</p>;
};

export default JourneyView;
