# Files and Directories

The project layout promotes a framework-agnostic *[monorepo](https://github.com/lerna/lerna#readme)*
structure which makes it easier to develop a modular application out of multiple
npm packages or developing multiple npm packages in a single repository.

```
${PROJECT_HOME}
  |- packages/
  |- src/
  |- package.json
```

An exploded view of the project layout reveals some more files which will
be explained below in context of the use case they contribute to.

```
${PROJECT_HOME}
  |- config/
  |    |- karma.conf.js
  |    |- karma.shim.js
  |    |- webpack.common.js
  |    |- webpack.dev.js
  |    |- webpack.prod.js
  |    |- webpack.test.js
  |
  |- packages/
  |    |- @foo/
  |    |   |- my-foo-app/
  |    |   |   |- src/
  |    |   |   |   | ...
  |    |   |   |- index.ts
  |    |   |   |- package.json
  |    |   |   |- README.md
  |    |   |   | ...
  |    |   | ...
  |    | ...
  |
  |- src/
  |    |- bundle-app.ts
  |    |- bundle-polyfills.ts
  |    |- bundle-theme.ts
  |    |- bundle-vendor.ts
  |    |- index.html
  |
  |- tsconfig-aot.json
  |- tsconfig-jit.json
  |- tsconfig.json
  |- lerna.json
  | ...
```

## Use Case: Developing TypeScript

[TypeScript](https://www.typescriptlang.org) is called a *superset of JavaScript*.
Simply put, its *JavaScript with Types*. TypeScript is *transpiled* into plain
JavaScript at build-time using the *TypeScript Compiler (tsc)*.  `tsc` applies
type checking and if necessary provides helpful messages if it infers any
constraint violations. TypeScript projects typically have a `tsconfig.json` which
provide tools (e.g build tools, IDEs) with information about the TS project as well
as `compilerOptions` by which we can configure `tsc`.

To build an *[Angular](https://angular.io/)* application we also need additional
`tsconfig-[aot|jit].json` files configuring Angular's tsc-Wrapper `ngc` which is
optimized to transpile Angular apps or libraries for Angular apps.

## Use Case: Building with Webpack

Building (TypeScript) libraries or applications includes transplilation, like
explained before. Apart from that there are often many more steps to perform in
a build, e.g.

- checking source code against code qualitity rules (*linting*)
- combining multiple files into fewer files, e.g. combining JavaScript modules into *barrels*, *chunks* or *bundles*
- minifying static resources to reduce file sizes and speed up file transfer
- optimizing static resources, e.g. combining icons into *sprites* or *base64*-encoded strings
- transpiling stylesheets from CSS supersets like SASS or LESS into CSS
- etc.

Most of these steps can be set up using *[Webpack](https://webpack.js.org)* and
Webpack-Plugins configured in `config/webpack.*.js` files.

Combining *all* resources into a single bundle is often not preferable, either
due to license restrictions or for optimization reasons. Webpack supports
*code splitting* which allows to split a code base into multiple *bundles*
or *chunks*. Our bundles for building an application are defined in
`src/bundle-*.ts` files. There you should import any JavaScript modules acting
as an entry module to Webpack's dependency resolution. Webpack will then include
any transitive dependencies. E.g. `bundle-app.ts` imports the bootstrap code for
an Angular application. Transitive dependencies which are used in more than one
chunk will be moved into a common chunk loaded before any dependent chunks.

## Use Case: Unit Testing with Karma

Before we can run tests we need to build the application. Since build parameters
can vary between a test environment and production environment, there is a
separate webpack configuration `config/webpack.test.js`.

We use *[Karma](https://karma-runner.github.io)* as a *Test Runner*. It provides
plug-ins for various testing frameworks like [Jasmine](https://jasmine.github.io)
or [Mocha](https://mochajs.org/) as well as plug-ins for running tests in a
tests in a headless browser or instrumenting code to collect test coverage metrics.
The relevant Karma configuration can be found in `config/karma.conf.js`.

Testing Angular projects with Karma requires a few libraries to be available as
well as a routine to tell Karma where to find the test specifications. Unless
Karma or Angular don't require any change its **not recommended to make
modifications** to `config/karma.shim.js`.

## Use Case: Publishing Packages

The directory layout provides a coherent structure for *app development* as well
as *library development*.

For a single-page-application sources may be grouped into packages as a means to
structure the codebase. There may be (feature-)packages which are very app-specific
and which you may not want to publish for reuse. **To build a single-page-app its
possible but not required to build and publish packages** from the `packages/`
folder. TypeScript and Webpack are configured in a way that they look up package
names in `node_modules/` *and* `packages/`.

Though, in large applications useful packages often evolve as a byproduct and
once they turn out to be reusable in other projects you may want to publish them
to a registry. In those cases *[Lerna](https://github.com/lerna/lerna#readme)*
might be helpful to you. Not only does it support publishing packages from monorepos
but if you develop a NodeJS application it also helps with symlinking
dependent packages inside `packages/`. You configure Lerna with `lerna.json`.
