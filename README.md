# ts-express-typeorm

TypeScript(ESM) & Express.js & TypeORM & GraphQL Example

## Dependencies

> nodejs@^18

- `inversify` (dependency injection)
- `express`
- `@godaddy/terminus`
- `graphql`
- `type-graphql`
- `@apollo/server`
- `typeorm`
- `class-validator`
- `morgan`
- `pino`
- `jest`(`ts-jest`)

## Linting & Formatting

- `typescript-eslint`
- `prettier`

## LiveReload for development

`concurrently` & `tsc` incremental build & `nodemon`

## Run

```sh
./db/init.sh
pm2 start ecosystem.config.js
```
