import { initializeClientSession } from './app_state';
import { SessionStateKeys } from './types/orion';

describe('app_state', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize required session keys', () => {
    initializeClientSession();

    expect(localStorage.getItem(SessionStateKeys.USER_NAME)).toBeDefined();
    expect(localStorage.getItem(SessionStateKeys.CURRENT_MOOD)).toBeDefined();
    expect(localStorage.getItem(SessionStateKeys.MEMORY_INITIALIZED)).toBe('false');
  });
});
