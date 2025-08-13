# React ERP Frontend

This is a full-stack ERP web application built with React, TypeScript, and Material UI for the frontend, and FastAPI with SQL Server for the backend. This README provides instructions for setting up and running the frontend project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Folder Structure](#folder-structure)
- [Testing](#testing)
- [Linting and Formatting](#linting-and-formatting)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- TypeScript
- A modern web browser (Chrome, Firefox, Edge)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd react-erp-frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Running the Application

To start the development server, run:

```bash
npm start
```

This will start the application on `http://localhost:3000`.

## Folder Structure

The project is organized as follows:

```
react-erp-frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons, theme config
│   ├── components/      # Shared UI components (Header, Footer, ChatWidget)
│   ├── layouts/         # App and Auth layouts
│   ├── features/        # Feature modules (dashboard, user, etc.)
│   ├── services/        # API services (axios + interceptors)
│   ├── hooks/           # Custom reusable hooks
│   ├── contexts/        # React Context providers (auth, menu)
│   ├── store/           # Global state (Redux Toolkit or Zustand)
│   ├── router/          # Routing and route guards
│   ├── types/           # Global TS types and interfaces
│   ├── utils/           # Utility functions and formatters
│   ├── constants/       # Route paths, roles, configs
│   ├── pages/           # Public pages (Login, Register, 404)
│   ├── App.tsx          # App root
│   └── index.tsx        # ReactDOM render entry
├── .env                 # Env variables
├── .env.example         # Example env variables
├── tsconfig.json        # TS config with paths
├── package.json         # Project metadata and dependencies
└── README.md            # Project documentation
```

## Testing

To run tests, use:

```bash
npm test
```

This will run the unit tests using Jest and React Testing Library.

## Linting and Formatting

To ensure code quality, ESLint and Prettier are set up. You can run the linter with:

```bash
npm run lint
```

To format the code, use:

```bash
npm run format
```

## Environment Variables

Create a `.env` file in the root directory and define your environment variables. You can refer to the `.env.example` file for the required variables.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.