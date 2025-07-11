'use strict';

console.log("===> CARGANDO MIDDLEWARES EN PRODUCCIÓN", process.env.NODE_ENV);

module.exports = [
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://109.235.65.193:3000'],
      headers: ['*'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::errors',
  'strapi::security',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
