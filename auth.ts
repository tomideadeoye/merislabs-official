// Simple auth mock for development purposes
export const auth = async () => {
  return {
    user: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com'
    }
  };
};