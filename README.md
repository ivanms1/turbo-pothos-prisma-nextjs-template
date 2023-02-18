# Turborepo + Pothos + Prisma + Next Template

## Technology stack

- Backend: [Node.js](https://nodejs.org/en/), [Pothos GraphQL](https://pothos-graphql.dev/), [Prisma](https://www.prisma.io/) and [Apollo Server](https://www.apollographql.com/docs/apollo-server/#:~:text=Apollo%20Server%20is%20an%20open,use%20data%20from%20any%20source.)
- Frontend: [React.js](https://reactjs.org/), [Next.js](https://nextjs.org/) and [Apollo Client](https://www.apollographql.com/docs/react/)

## Monorepo Setup

- `apps/api`: [Node.js](https://nodejs.org/en/) app, provides all the apis and connects to the database.
- `apps/web`: Main app powered by [Next.js](https://nextjs.org)
- `apps/admin`: [Next.js](https://nextjs.org) app for admin purposes
- `packages/ui`: Internal component library used by both `web` and `admin` applications
- `packages/apollo-hooks`: Libary of apollo-graphql hooks generated by [GraphQL Code Generator](https://www.graphql-code-generator.com/) for `web` and `admin` app to consume

## Requirements

- ### General

  - **Yarn**

  This repository uses [Yarn](https://classic.yarnpkg.com/lang/en/) as a package manager.

- ### Backend

  - **Enviroment Variables**

    Inside the `apps/api` directory

    ```
    JWT_SECRET="Any random string, only for development"
    SERVER_URL="http://localhost"
    ```

- ### Frontend

  - **Enviroment Variables**

    Inside the `apps/web` and `apps/admin` directories

    ```
    NEXT_PUBLIC_SERVER_URL="http://localhost:8080/graphql"
    ```

## Running the app

- To install project deps, run

  ```
  yarn install
  ```

- Initialize the database or sync the database schema

  ```
  yarn db:push
  ```

- Generate the pr the prismas client and types

  ```
  yarn db:generate
  ```

- Seed the database

  ```
  yarn db:seed
  ```

- Run app

  - Start the server

    ```
    yarn dev:api
    ```

  - Start server + web

    ```
    yarn dev:web
    ```

  - Start server + admin

    ```
    yarn dev:admin
    ```

  - Start server + admin + web
    ```
    yarn dev
    ```

## Generating GraphQL Hooks

- To generate the graphql hooks, run

  ```
  yarn generate:hooks
  ```

  This command will detect all the graphql files inside the `apps/web` and `apps/admin` directories and generate the hooks for them.
