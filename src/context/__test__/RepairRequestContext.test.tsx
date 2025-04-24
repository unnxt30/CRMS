import { render, screen } from '@testing-library/react';
import { RepairRequestProvider, useRepairRequests } from '../RepairRequestContext';

const TestComponent = () => {
  const { userRequests } = useRepairRequests();
  return <div>Requests: {userRequests.length}</div>;
};

describe('RepairRequestContext', () => {
  it('provides repair request data to children', () => {
    render(
      <RepairRequestProvider>
        <TestComponent />
      </RepairRequestProvider>
    );
    expect(screen.getByText('Requests: 0')).toBeInTheDocument();
  });
});
