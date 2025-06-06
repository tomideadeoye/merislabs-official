import { config } from 'dotenv';
import { resolve } from 'path';

// Explicitly load .env.local for test environment
config({ path: resolve(process.cwd(), '.env.local') });

// Existing setup code (if any) should follow here
