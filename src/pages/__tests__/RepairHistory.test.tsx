import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RepairRequestProvider } from '@/context/RepairRequestContext';
import RepairHistory from '../requests/RepairHistory';

describe('RepairHistory', () => {
  const wrapper = ({ children }) => (
    <BrowserRouter>
      <RepairRequestProvider>
        {children}
      </RepairRequestProvider>
    </BrowserRouter>
  );

  it('renders repair history page', () => {
    render(<RepairHistory />, { wrapper });
    expect(screen.getByText('Your Repair History')).toBeInTheDocument();
  });

  it('filters requests correctly', () => {
    render(<RepairHistory />, { wrapper });
    const filterSelect = screen.getByRole('combobox');
    fireEvent.change(filterSelect, { target: { value: 'completed' } });
    // Add assertions based on your filtered data
  });
});
