# OpenFabricAPI

OpenFabricAPI is a RESTful API built with TypeScript, Express, and MongoDB, designed to provide a scalable and modular structure for developing APIs with a focus on maintainability and reusability.

## Features

- TypeScript for static typing and better development experience
- Express for handling HTTP requests and responses
- MongoDB with Mongoose for schema-based data modeling
- JWT authentication and middleware for secure endpoints
- Error handling and validation using Joi validators
- Rate limiting to prevent abuse
- Pagination for large data sets
- Caching using Redis
- API documentation with Swagger
- Logging using Winston
- Pagination support
- Security best practices with Helmet
- Swagger for API documentation
- Environment-based configuration

## Libraries Used

- express
- mongoose
- joi
- jsonwebtoken
- helmet
- cors
- express-rate-limit
- winston
- swagger-ui-express
- swagger-jsdoc

## Project Structure

- `src` - Contains the main source code for the API
  - `components` - Contains the different components (or modules) of the API, such as products and users
    - `products` - Contains the products component, split into multiple versions
      - `v1` - Contains version 1 of the products component
        - `data` - Contains the data layer, including models, repositories, and interfaces
        - `services` - Contains the business logic for the products component
        - `web` - Contains the web layer, including controllers, routes, and validators
    - `auth` - Contains the users component, split into multiple versions
      - `v1` - Contains version 1 of the users component
        - `data` - Contains the data layer, including models, repositories, and interfaces
        - `services` - Contains the business logic for the users component
        - `web` - Contains the web layer, including controllers, routes, and validators
  - `config` - Contains configuration files for various parts of the API
  - `helpers` - Contains helper functions for common tasks
  - `interfaces` - Contains shared interfaces for the API
  - `middleware` - Contains middleware functions for the API
  - `repositories` - Contains base repository classes and interfaces
  - `utils` - Contains utility functions for the API
  - `app.ts` - Contains the main Express app setup
  - `index.ts` - Contains the entry point for the API
  - `server.ts` - Contains the HTTP server setup
- `bin` - Contains the executable script for starting the server
- `.env` - Contains environment variables
- `.gitignore` - Contains a list of files and directories to be ignored by git
- `package.json` - Contains the project's dependencies and scripts
- `tsconfig.json` - Contains the TypeScript configuration for the project
- `README.md` - Contains the documentation for the project

## Getting Started

1. Clone the repository and navigate to the project root directory.
2. Run `npm install` to install the dependencies.
3. Create a `.env` file with the required environment variables.
4. Run `npm run dev` to start the development server.

## Contributing

Please read the contributing guidelines for the project before making any changes or submitting pull requests.

## Author

- Tsegaw Demissie 
  - Email: tsegaw.at@gmail.com
