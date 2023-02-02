import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';

export const JourneyDetailView: React.FC = () => {
  const router = useRouter();

  const { journey: journeyId } = router.query;

  const { data: journey } = trpc.journey.getOne.useQuery(Number(journeyId) ?? 0);

  if (!journey) return <p>No journey</p>;

  return (
    <p>
      {journey.departureStation} - {journey.arrivalStation}
    </p>
  );
};
