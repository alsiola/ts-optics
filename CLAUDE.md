# fp-ts-optics

## Project Overview

This is a TypeScript library built on top of fp-ts, providing optics utilities for functional programming. The codebase uses tsc for compilation and jest for testing.

## Build & Test Commands

**Build:**
```bash
tsc
```

**Test:**
```bash
jest --coverage
```

**Lint:**
```bash
yarn eslint . --ext .js,.jsx,.ts,.tsx
```

## High-Risk Areas

- **`.circleci/config.yml`**: CI/CD configuration controlling the entire build and deployment pipeline. Any misconfiguration here blocks releases. Recent changes span 124 lines.

- **`src/option-lens.ts`**: Core library file with recent API changes including modifications to the `getOrElse` method and removal of `asOptional`. These are breaking changes that directly affect the public API surface.

- **`yarn.lock`**: Dependency lock file with 644 lines of churn. Large-scale dependency updates carry potential compatibility risks across the dependency tree.

- **`src/from-prop.ts`**: Core library file handling array and nullable logic critical to the library's functionality. Changes to this module impact fundamental optics operations.

- **`jest.config.js`**: Test configuration affecting test execution and coverage reporting in CI/CD. Changes here can break test runs or produce misleading coverage metrics.

## Code Conventions

- The project follows functional programming principles using fp-ts
- TypeScript is used throughout with strict typing
- Code must pass ESLint checks for .js, .jsx, .ts, and .tsx files
- Test coverage is tracked and enforced through jest
