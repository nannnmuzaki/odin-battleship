### Simple Webpack Setup

# Vanilla JS Webpack Template

A minimalist boilerplate for frontend JavaScript projects, pre-configured with modern bundling and strict linting.

## Stack

- **Bundler:** Webpack 5
- **Linter:** ESLint (v9 Flat Config)
- **Formatter:** Prettier

## Environment Constraints

This template is explicitly configured for **Vanilla JavaScript** running in the **Browser**.

**Do NOT use this template for:**

- **React:** ESLint is not configured with `eslint-plugin-react` or JSX parsing.
- **Node.js Backends:** The linter assumes a browser environment (`window`, `document`) and will fail to recognize Node global variables.
- **TypeScript:** The parsing engine is strictly set for standard ECMAScript.

## Scripts

- `npm run build` - Compiles the production bundle to `/dist`
- `npm run start` - Starts the Webpack dev server
- `npm run lint` - Runs ESLint in check mode (CI/CD standard)
- `npm run format` - Runs Prettier in write mode

## Notes

- Automatic github pages build and deploy
- Don't forget to rename the project name inside package.json and package-lock.json
- Remove js/jest-test as it's just a test to make sure jest setup is working properly
