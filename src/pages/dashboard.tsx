import { GetServerSideProps } from 'next';

import { protectedRoute } from '@/utils/protected';

const Dashboard: React.FC = () => <p>Welcome to the protected dashboard</p>;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return protectedRoute(req);
};

export default Dashboard;
