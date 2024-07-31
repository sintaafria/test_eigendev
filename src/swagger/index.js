const YAML = require('yaml')
const fs = require('fs')
const swaggerUi = require('swagger-ui-express')
const dotenv = require("dotenv");
dotenv.config();

const options = {
  swaggerDefinition: {
    restapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'Simple library transaction api',
    },
    schemes: ['http'],
    host: `localhost:${process.env.PORT || 3001}`,
    basePath: '/api'
  },
  apis: ['**/app/routes/*.js'],
}

// const swaggerDoc = YAML.load('./src/swagger/swagger.yaml')
const file = fs.readFileSync('./src/swagger/swagger.yml', 'utf8')
const swaggerDoc = YAML.parse(file);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
}