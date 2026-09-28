# Vending Machine

A responsive React and TypeScript vending machine. Products are loaded from a mocked HTTP API, while product creation,
editing, and deletion remain in the browser's application state.

## Technology

- React and TypeScript
- Vite
- Express
- Vitest and React Testing Library
- ESLint and Prettier

## Requirements

- Node.js 22 or newer
- npm

## Quick start

From the project root, install the dependencies and start development mode:

```bash
npm install
npm run dev
```

The development command starts both services:

- Application: `http://localhost:5173`
- Products API: `http://localhost:3001/api/products`
- Health check: `http://localhost:3001/api/health`

The Vite development server forwards `/api` requests to the Express server. Keep the terminal running while using the
application. Stop both services with `Ctrl+C`.

## Production build and start

Build the client and server, then start the compiled application:

```bash
npm run build
npm start
```

Open `http://localhost:3001`. In production mode, the Express process serves both the compiled React application and the
API.

## Commands

```bash
npm run dev           # Start the client and mock API
npm run build         # Create client and server production builds
npm start             # Start the compiled application and API
npm test              # Run the test suite once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate domain and state coverage
npm run lint          # Run ESLint
npm run format        # Format project files
npm run format:check  # Verify formatting without changing files
```

## Currency and accepted coins

The application uses EUR. It accepts only:

- €0.10
- €0.20
- €0.50
- €1.00
- €2.00

Money is stored as integer cents to avoid floating-point errors.

The machine starts with a finite reserve of each accepted denomination. Inserted coins join that reserve after a
successful purchase, and returned change is removed from it.

## Business rules

- Each product has its own price and a quantity from 0 through 15.
- Prices are positive and use 10-cent increments.
- Initial products are fetched from `GET /api/products`.
- Product CRUD operations change React state only and are reset by a page reload.
- Unsupported coins are rejected by the domain logic.
- A product cannot be purchased when it is out of stock or credit is insufficient.
- A successful purchase decreases stock by exactly one.
- Remaining credit is returned as change using accepted denominations.
- Inserted coins enter a finite cashbox after a successful purchase.
- A purchase is rejected without changing stock or credit when exact change is unavailable.
- Returning coins cancels the transaction without changing inventory.

## Project structure

```text
client/src/api         HTTP clients and a shared fetchJson helper
client/src/components  React interface, including a reusable accessible Modal
client/src/domain      Money, coins, validation, change, and purchase rules
client/src/hooks       React hooks (product loading)
client/src/state       Reducer, actions, and notification builders
client/src/styles      Split stylesheets (tokens, base, layout, components, responsive)
server/data            Initial product and product-image data
server/index.ts        Mock HTTP API entry point
```

## Verification

Before submitting changes, run:

```bash
npm run lint
npm test
npm run build
npm run format:check
```

The test suite covers product validation, coin validation, bounded change calculation, cashbox updates, transaction
atomicity, reducer behavior, API error handling, and the main customer and inventory flows.

## Build output

`npm run build` writes the client to `dist/client` and the API to `dist/server`.
After building, `npm start` serves both the application and API from `http://localhost:3001`.

## Deliberate scope

Authentication, persistence, and a database are outside this project's requirements. The cashbox starts with a small
reserve of every accepted denomination and changes only for successful purchases.
