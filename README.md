# `tsci` - The TSCircuit Command Line Tool

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

Run `bun bootstrap` to install dependencies and `bun cli.ts` to run test the cli in development.

To run tests, run `bun test`

If you want to test developing, run `bun dev` and visit http://localhost:5173. The project being
loaded is inside `example-project`

![image](https://github.com/tscircuit/cli/assets/1910070/cabb180d-a64f-4fe5-a6af-26f990af39b3)

![image](https://github.com/tscircuit/cli/assets/1910070/9350c52c-4263-4ba2-b06b-61130b1aab3b)

![image](https://github.com/tscircuit/cli/assets/1910070/d6facd4d-0887-4871-8aa1-e525c519c50d)

## Features Coming Soon

- [`tsci format`](https://github.com/tscircuit/cli/issues/1)
- [`tsci lint`](https://github.com/tscircuit/cli/issues/2)
- [`tsci open`](https://github.com/tscircuit/cli/issues/4)
