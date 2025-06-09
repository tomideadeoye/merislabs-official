import { config } from 'dotenv';
import { resolve } from 'path';

// Explicitly load .env.local for test environment
config({ path: resolve(process.cwd(), '.env') });

import '@testing-library/jest-dom';

// Existing setup code (if any) should follow here
