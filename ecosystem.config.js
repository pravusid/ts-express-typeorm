/* eslint-disable */
module.exports = {
  apps: [
    {
      name: 'app',
      script: './dist/main.js',
      instances: 1,
      kill_timeout: 5000,
      merge_logs: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
