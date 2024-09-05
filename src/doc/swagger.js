import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { ENV } from '../lib/constants.js';

dotenv.config();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API with Swagger',
    version: '1.0.0',
    description: 'A sample API',
  },
  servers: [
    {
      url: `http://localhost:${process.env[ENV.NODE_PORT]}`,
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['src/doc/swaggerPaths.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
