import { screen, render, act } from '@testing-library/react';
import agent from '../../../app/api/agent';
import { Activity } from '../../../app/models/activity';
import { v4 } from 'uuid';
import ActivityDashboard from './ActivityDashboard';

jest.mock('../../../app/api/agent');

describe('Test for App component', () => {
  test('It renders correctly with all activities obtained from API', async () => {
    
    const activities = [new Activity(), new Activity()];
    activities[0].title = 'Act 1';
    activities[0].id = v4();
    activities[1].title = 'Act 2';
    activities[1].id = v4();
    const responsePromise = Promise.resolve(activities);
    agent.Activities.list.mockReturnValue(responsePromise);
    
    render(<ActivityDashboard />);
    
    await act(() => responsePromise)
    expect(screen.getByText('Act 1')).toBeInTheDocument();
    expect(screen.getByText('Act 2')).toBeInTheDocument();
  })
})