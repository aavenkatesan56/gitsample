module.exports = {
  apps: [{
  name: 'sample1',
  script: './index.js',
  instances: 3,
  exec_mode: 'cluster',
  wait_ready: true,
  listen_timeout: 50000,
  kill_timeout: 5000
  }]
}