const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';

// Load the appropriate environment configuration
const result = dotenv.config({ path: `.env.${env}` });

if (result.error) {
  throw result.error;
}
