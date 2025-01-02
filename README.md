# `tsci` - The TSCircuit Command Line & Development Tools


> [!CAUTION]
> The v0.0.x version of the CLI has been completely rewritten, check out [the new version here](https://github.com/tscircuit/cli)

---

Command line tool for developing tscircuit projects and interacting with the
tscircuit registry.

## Installation

```bash
npm install -g @tscircuit/cli
```

## Usage

The `tsci` CLI is interactive by default. You can specify the `-y` or any fully-
qualified with all required arguments to skip the interactive mode.

```bash
# Interactively choose a command and options:
tsci

# Login
tsci login

# Create a Project
tsci init

# Develop a Project (preview, export, and edit circuit files in browser)
tsci dev

# Manage Dependencies
tsci install
tsci add some-package
tsci remove some-package

# Publish a Project
tsci publish
```

## Developing

This project is developed with [bun](https://bun.sh/), make sure you have
that installed.

Run `bun install` to install dependencies and `bun cli/cli.ts` to run test the cli in development, or `bun run dev` to run the dev server.

To run tests, run `bun test`

If you want to test developing, run `bun dev` and visit http://127.0.0.1:5173. The project being
loaded is inside `example-project`

![image](https://github.com/tscircuit/cli/assets/1910070/d6facd4d-0887-4871-8aa1-e525c519c50d)

## Features Coming Soon

- [`tsci format`](https://github.com/tscircuit/cli/issues/1)
- [`tsci lint`](https://github.com/tscircuit/cli/issues/2)
- [`tsci open`](https://github.com/tscircuit/cli/issues/4)
