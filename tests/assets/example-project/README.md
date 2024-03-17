# seveibar/example-project-3

To develop and view the examples, run `tsci dev` and open [http://localhost:3020](http://localhost:3020) in your browser.

## Developing

You should install an editor like [VS Code](https://code.visualstudio.com/) with a typescript extension. Many web developers already have this.

Usually, you'll want to develop some named circuits inside of the `lib` directory,
export them in the `index.ts` file, then show how to use them in the `examples` directory.

Any file in `examples` will be automatically loaded and appear in the browser preview when you run `tsci dev`. It auto-reloads when you make changes, no need to reload the page or re-run the command.

> [!TIP] Make sure to replace this README with some details about your project and how to use it.

## Publishing

After you're satisfied with your project, publish it on the [tscircuit registry](https://registry.tscircuit.com) with `tsci publish`