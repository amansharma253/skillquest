import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
const axios = require('axios'); // Use CommonJS syntax for axios
jest.mock('axios'); // Mock axios

test('allows user to log in', async () => {
  // Mock the API response for the login endpoint
  axios.post.mockResolvedValue({
    data: {
      token: 'fake-token',
      user: { 
        username: 'testuser', 
        essence: 0, 
        rank: 'Apprentice', 
        completedChallenges: [], 
        isAdmin: false 
      },
    },
  });

  // Render the App component
  render(<App />);

  // Simulate user input for username and password
  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

  // Simulate clicking the login button
  fireEvent.click(screen.getByText('Login'));

  // Wait for the dashboard to appear and verify the welcome message
  await waitFor(() => {
    expect(screen.getByText(/Welcome, testuser!/i)).toBeInTheDocument();
  });
});
