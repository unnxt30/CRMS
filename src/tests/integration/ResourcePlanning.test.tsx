
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CreateWorkOrderDialog } from '@/components/supervisor/CreateWorkOrderDialog';
import { RepairRequestProvider } from '@/context/RepairRequestContext';
import { ResourceProvider } from '@/context/ResourceContext';
import { AuthProvider } from '@/context/AuthContext';

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  }
}));

// Test wrapper to provide necessary context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      <RepairRequestProvider>
        <ResourceProvider>
          {children}
        </ResourceProvider>
      </RepairRequestProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('Resource Planning - Create Work Order Integration', () => {
  test('opens dialog when button is clicked', async () => {
    render(
      <TestWrapper>
        <CreateWorkOrderDialog requestId="req1" requestTitle="Test Request" />
      </TestWrapper>
    );

    // Check if the button exists
    const createButton = screen.getByText('Create Work Order');
    expect(createButton).toBeInTheDocument();
    
    // Click the button to open the dialog
    fireEvent.click(createButton);
    
    // Check if dialog content appears
    await waitFor(() => {
      expect(screen.getByText('Work Order Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Required Resources')).toBeInTheDocument();
    });
  });

  test('allows resource selection and form submission', async () => {
    render(
      <TestWrapper>
        <CreateWorkOrderDialog requestId="req1" requestTitle="Test Request" />
      </TestWrapper>
    );
    
    // Open the dialog
    fireEvent.click(screen.getByText('Create Work Order'));
    
    // Fill out the form
    await waitFor(() => {
      const titleInput = screen.getByLabelText('Work Order Title');
      fireEvent.change(titleInput, { target: { value: 'New Work Order' } });
      
      const descriptionTextarea = screen.getByLabelText('Description');
      fireEvent.change(descriptionTextarea, { target: { value: 'This is a test work order' } });
      
      const workersInput = screen.getByLabelText('Assigned Workers (comma separated)');
      fireEvent.change(workersInput, { target: { value: 'John Doe, Jane Smith' } });
      
      // Check if resources are listed and try to select them
      // Note: This part might need adjustment based on actual resource data
      const resourceCheckboxes = screen.queryAllByRole('checkbox');
      if (resourceCheckboxes.length > 0) {
        fireEvent.click(resourceCheckboxes[0]);
      }
      
      // Submit the form
      const submitButton = screen.getByText('Create Work Order');
      fireEvent.click(submitButton);
    });
    
    // Expect toast to be called (would be more specific in a real test)
    // This part would be expanded in a real test with specific expectations
  });
});
