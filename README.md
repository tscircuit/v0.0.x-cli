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

## Features Coming Soon

- [`tsci format`](https://github.com/tscircuit/cli/issues/1)
- [`tsci lint`](https://github.com/tscircuit/cli/issues/2)
- [`tsci open`](https://github.com/tscircuit/cli/issues/4)
