/* eslint-disable */
module.exports = {
  apps: [
    {
      name: 'app',
      script: './dist/main.js',
      instances: 1,
      restart_delay: 1000,
      kill_timeout: 30000,
      merge_logs: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
