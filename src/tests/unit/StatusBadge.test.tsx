
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RequestStatus } from '@/types';

describe('StatusBadge Component', () => {
  test('renders PENDING status correctly', () => {
    render(<StatusBadge status={RequestStatus.PENDING} />);
    const badgeElement = screen.getByText('Pending');
    expect(badgeElement).toBeInTheDocument();
    // Check for the correct styling class
    expect(badgeElement.className).toContain('bg-yellow-100');
  });

  test('renders COMPLETED status correctly', () => {
    render(<StatusBadge status={RequestStatus.COMPLETED} />);
    const badgeElement = screen.getByText('Completed');
    expect(badgeElement).toBeInTheDocument();
    // Check for the correct styling class
    expect(badgeElement.className).toContain('bg-green-100');
  });

  test('renders IN_PROGRESS status correctly', () => {
    render(<StatusBadge status={RequestStatus.IN_PROGRESS} />);
    const badgeElement = screen.getByText('In Progress');
    expect(badgeElement).toBeInTheDocument();
    // Check for the correct styling class
    expect(badgeElement.className).toContain('bg-orange-100');
  });

  test('renders REJECTED status correctly', () => {
    render(<StatusBadge status={RequestStatus.REJECTED} />);
    const badgeElement = screen.getByText('Rejected');
    expect(badgeElement).toBeInTheDocument();
    // Check for the correct styling class
    expect(badgeElement.className).toContain('bg-red-100');
  });

  test('renders INSPECTED status correctly', () => {
    render(<StatusBadge status={RequestStatus.INSPECTED} />);
    const badgeElement = screen.getByText('Inspected');
    expect(badgeElement).toBeInTheDocument();
    // Check for the correct styling class
    expect(badgeElement.className).toContain('bg-blue-100');
  });

  test('renders SCHEDULED status correctly', () => {
    render(<StatusBadge status={RequestStatus.SCHEDULED} />);
    const badgeElement = screen.getByText('Scheduled');
    expect(badgeElement).toBeInTheDocument();
    // Check for the correct styling class
    expect(badgeElement.className).toContain('bg-purple-100');
  });

  test('renders unknown status with fallback styling', () => {
    render(<StatusBadge status={'UNKNOWN' as RequestStatus} />);
    const badgeElement = screen.getByText('Unknown');
    expect(badgeElement).toBeInTheDocument();
    // Check for the correct fallback styling class
    expect(badgeElement.className).toContain('bg-gray-100');
  });
});
