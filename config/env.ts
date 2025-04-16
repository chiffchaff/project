const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api',
  },
  staging: {
    apiUrl: 'https://staging-api.rentingapp.com/api',
  },
  prod: {
    apiUrl: 'https://api.rentingapp.com/api',
  },
};

const getEnvVars = (env = process.env.NODE_ENV || 'development') => {
  if (env === 'development') {
    return ENV.dev;
  } else if (env === 'staging') {
    return ENV.staging;
  } else if (env === 'production') {
    return ENV.prod;
  }
  return ENV.dev;
};

export default getEnvVars;