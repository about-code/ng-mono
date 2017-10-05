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

An exploded view of the project structure reveals some more files which will
be explained below in context of the use case they contribute to.

```
${PROJECT_HOME}
  |- config/
  |    |- karma.conf.js          // Karma Test Runner Config (Unit Tests)
  |    |- karma.shim.js          // Karma-Angular-Webpack Integration
  |    |- protractor.js          // Protractor Test Runner Config (E2E-Tests)
  |    |- webpack.common.js      // Common Bundling Params
  |    |- webpack.dev.js         // Development-Time Bundling (e.g. no minifcation)
  |    |- webpack.prod.js        // Production-Build Bundling
  |    |- webpack.test.js        // Test-Build Bundling
  |
  |- packages/                   // All your source code does belong to here ;-)
  |    |- @foo/                  // Scoped Package support
  |    |   |- my-foo-app/        // Your app is a package ...
  |    |   |- my-foo-feature/    // ... your features are packages.
  |    |   |   |- src/
  |    |   |   |   | ...
  |    |   |   |- index.ts
  |    |   |   |- ng-package.json  // Package-Build config (ng-packagr)
  |    |   |   |- package.json     // package manifest
  |    |   |   |- README.md        // Be good to your fellows
  |    |   |   | ...
  |    |   | ...
  |    | ...
  |
  |- src/                        // Entry Points for Application Projects
  |    |- bundle-app.ts
  |    |- bundle-polyfills.ts
  |    |- bundle-theme.ts
  |    |- bundle-vendor.ts
  |    |- index.html
  |
  |- tsconfig-aot.json       // Angular AOT-Build Config for 'ngc'
  |- tsconfig.json           // TypeScript IDE config
  |- lerna.json              // Monorepo-Management with lernajs.io
  |- package.json            // Project manifest. Don't publish projects
  |- README.md               // Project basics and how to set up dev environment
```

## Use Case: Developing TypeScript

[TypeScript](https://www.typescriptlang.org) is *JavaScript with static typing*.
TypeScript is *transpiled* into plain JavaScript at build-time using the
*TypeScript Compiler (tsc)*. It applies type checking and if necessary provides
helpful messages if it infers any type constraint violations. TypeScript
projects have a `tsconfig.json` which provide the compiler and IDEs with the
necessary build params.

To build an *[Angular](https://angular.io/)* application we also need an
additional `tsconfig-aot.json` file for configuring Angular's custom tsc-wrapper
`ngc` which is optimized to transpile for Angular apps or libraries. You may only
need to touch this if you develop `packages/` with more than one package scope
in the same repo. In this case make sure there's a path mapping for each scope.

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

## Use Case: End-to-End / UI-Testing with Protractor

[Protractor](http://www.protractortest.org) is a Test-Runner for UI-Tests similar
to Karma for Unit Tests. It assists with browser automation and provides tools
like `webdriver-manager` to manage the drivers needed to communicate with the
browsers. Customize its `config/protractor.js` to fit your testing requirements.

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
