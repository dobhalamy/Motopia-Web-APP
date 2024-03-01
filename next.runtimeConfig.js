const serverRuntimeConfig = {};

const publicRuntimeConfig = {
  GROUP_NAME: process.env.GROUP_NAME,
  NODE_ENV: process.env.NODE_ENV, // XXX Used in utils/env
};

module.exports = {
  serverRuntimeConfig,
  publicRuntimeConfig,
};
