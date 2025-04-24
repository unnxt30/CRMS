
import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatsCard } from '@/components/common/StatsCard';

describe('StatsCard Component', () => {
  test('renders with basic props', () => {
    render(
      <StatsCard 
        title="Total Requests" 
        value="42"
        icon={<span data-testid="test-icon">Icon</span>}
        description="All time repair requests"
      />
    );
    
    expect(screen.getByText('Total Requests')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('All time repair requests')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  test('renders with positive trend', () => {
    render(
      <StatsCard 
        title="Completion Rate" 
        value="85%"
        icon={<span>Icon</span>}
        description="Requests completed"
        trend={{ value: 12, isPositive: true }}
      />
    );
    
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Requests completed')).toBeInTheDocument();
    expect(screen.getByText('↑ 12%')).toBeInTheDocument();
    
    // Check that the trend has the positive class
    const trendElement = screen.getByText('↑ 12%');
    expect(trendElement.className).toContain('text-green-600');
  });

  test('renders with negative trend', () => {
    render(
      <StatsCard 
        title="Issues" 
        value="15"
        icon={<span>Icon</span>}
        description="Current issues"
        trend={{ value: 5, isPositive: false }}
      />
    );
    
    expect(screen.getByText('Issues')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Current issues')).toBeInTheDocument();
    expect(screen.getByText('↓ 5%')).toBeInTheDocument();
    
    // Check that the trend has the negative class
    const trendElement = screen.getByText('↓ 5%');
    expect(trendElement.className).toContain('text-red-600');
  });

  test('renders without trend', () => {
    render(
      <StatsCard 
        title="Resources" 
        value="25"
        icon={<span>Icon</span>}
        description="Available resources"
      />
    );
    
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Available resources')).toBeInTheDocument();
    
    // Ensure trend is not rendered
    const trendElements = screen.queryByText(/↑|↓/);
    expect(trendElements).not.toBeInTheDocument();
  });
});
