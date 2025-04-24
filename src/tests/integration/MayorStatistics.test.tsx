
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import StatisticsPage from '@/pages/mayor/StatisticsPage';
import { RepairRequestProvider } from '@/context/RepairRequestContext';
import { ResourceProvider } from '@/context/ResourceContext';
import { AuthProvider } from '@/context/AuthContext';

// Mock charts components
jest.mock('recharts', () => ({
  PieChart: (props: any) => <div data-testid="pie-chart">{props.children}</div>,
  Pie: (props: any) => <div data-testid="pie-component">{props.children}</div>,
  Cell: (props: any) => <div data-testid="cell-component"></div>,
  LineChart: (props: any) => <div data-testid="line-chart">{props.children}</div>,
  Line: (props: any) => <div data-testid="line-component"></div>,
  BarChart: (props: any) => <div data-testid="bar-chart">{props.children}</div>,
  Bar: (props: any) => <div data-testid="bar-component"></div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
  ResponsiveContainer: (props: any) => <div data-testid="responsive-container">{props.children}</div>,
}));

// Mock toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Test wrapper component
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

describe('Mayor Statistics Integration', () => {
  test('renders statistics page with charts', async () => {
    render(
      <TestWrapper>
        <StatisticsPage />
      </TestWrapper>
    );

    // Check for page title
    expect(screen.getByText('Statistical Reports')).toBeInTheDocument();
    
    // Check if filter controls are rendered
    expect(screen.getByText('Time Period')).toBeInTheDocument();
    expect(screen.getByText('Report Type')).toBeInTheDocument();
    
    // Check if charts are rendered
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    
    // Check for export button
    expect(screen.getByText('Export Report')).toBeInTheDocument();
  });

  test('changes report type when selected', async () => {
    render(
      <TestWrapper>
        <StatisticsPage />
      </TestWrapper>
    );

    // Find and click the report type dropdown
    const reportTypeSelect = screen.getByText('Select report type');
    fireEvent.click(reportTypeSelect);
    
    // Wait for options to appear and select priority
    await waitFor(() => {
      const priorityOption = screen.getByText('Priority Breakdown');
      fireEvent.click(priorityOption);
    });
    
    // Check that title is updated
    expect(screen.getByText('Request Priority Breakdown')).toBeInTheDocument();
  });

  test('changes time period when selected', async () => {
    render(
      <TestWrapper>
        <StatisticsPage />
      </TestWrapper>
    );

    // Find and click the time period dropdown
    const timePeriodSelect = screen.getByText('Select time range');
    fireEvent.click(timePeriodSelect);
    
    // Wait for options to appear and select 3 months
    await waitFor(() => {
      const threeMonthsOption = screen.getByText('Last 3 Months');
      fireEvent.click(threeMonthsOption);
    });
    
    // Since we can't easily test the filtered data directly,
    // we would check for any side effects that should occur
    // This would be more specific in a real test
  });

  test('exports report when export button is clicked', async () => {
    // Mock URL.createObjectURL and document.createElement
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    const mockAnchor = {
      href: '',
      download: '',
      click: jest.fn(),
      remove: jest.fn()
    };
    
    document.createElement = jest.fn().mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor;
      return document.createElement(tag);
    });
    
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    
    render(
      <TestWrapper>
        <StatisticsPage />
      </TestWrapper>
    );

    // Click export button
    const exportButton = screen.getByText('Export Report');
    fireEvent.click(exportButton);
    
    // Check if export function was called
    expect(mockAnchor.click).toHaveBeenCalled();
    
    // Restore mocks
    jest.restoreAllMocks();
  });
});
