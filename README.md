This is the NotANotion project, a personal project of mine that mimics the system within Notion. The purpose of creating this personal project is to understand how the system in Notion works.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Second, visit https://www.convex.dev/ & https://clerk.com/ to registering your account.

Third, run the `convex` (Using this tech for store data in DB, write query on Typescript directly, real-time data synchronization):

```bash
npm run convex:dev
```

## Features

- Authenticate (Login, Register, Logout with Clerk)
- CRUD a Document
