import { render, screen } from '@testing-library/react';
import Journey from '../Journey';

const journey = {
  id: 23,
  duration: 33,
  stops: 1,
  departureStation: 'Basel SBB',
  arrivalStation: 'Zürich HB',
  distance: 75,
  departureTime: '2020-04-01T12:00:00.000Z',
  arrivalTime: '2020-04-01T12:00:00.000Z',
};

describe('Journey', () => {
  it('renders departure station', () => {
    render(<Journey journey={journey} />);

    const departureStation = screen.getByText('Basel SBB');

    expect(departureStation).toBeInTheDocument();
  });

  it('renders arrival station', () => {
    render(<Journey journey={journey} />);

    const departureStation = screen.getByText('Zürich HB');

    expect(departureStation).toBeInTheDocument();
  });
});
