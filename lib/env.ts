
/**
 * Environment validation utility.
 * Prevents the app from running in an invalid state.
 */

export const validateEnv = () => {
  const required = ['API_KEY'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    return false;
  }
  return true;
};

export const env = {
  apiKey: process.env.API_KEY || '',
  isProduction: window.location.hostname !== 'localhost',
};
