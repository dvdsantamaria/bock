module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: '/root/bock/clean-strapi',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 1337,
      },
    },
  ],
};
