# Rationale

Developing an app means developing *packages* or *libraries*. All of an apps source code is part of one or more packages in the `packages/` folder. Packages are to be designed with modularity best practices in mind. They are to be written with focus on a task or feature. They are to be thought with reusability in mind where it makes sense - particularily for technical concerns which are needed repeatedly in every app.

## Project Structure

The project layout promotes a framework-agnostic *[monorepo](https://github.com/lerna/lerna#readme)*
structure which makes it easier to develop a modular application from multiple npm packages or developing multiple npm packages/libraries in a single repository.

```
${PROJECT_HOME}
  |- packages/
  |- src/
  |    |- bundle-app.ts
  |    |- bundle-polyfills.ts
  |    |- bundle-theme.ts
  |    |- bundle-vendor.ts
  |    |- index.html
  |
  |- package.json
```

The `src/` folder contains entry bundles, only. They are required when developing and bundling an application (not a necessarily when developing a library). To bundle external libraries or polyfills import them into `bundle-vendor.ts` or `bundle-polyfills.ts` (see also [angular.io](https://angular.io))

## Packages and Library Development

Feature packages must be structured according to NPM package best practices:
```
${PROJECT_HOME}
  |- packages/
  |    |- @scope/                    // Optinal package scope
  |        |- my-foo-app/            // Your app package
  |        |- my-foo-feature/        // your feature packages
  |              |- src/
  |              |    |- ...         // required - everything apart index.ts should be in src/
  |              |- .npmignore       // optional - may be required when publishing package
  |              |- .gitignore       // optional - may be required when moving to a separate repo
  |              |- LICENSE.txt      // optional - required when publishing a package
  |              |- ng-package.json  // optional - ng-packagr config to build a package for publishing
  |              |- index.ts         // required - public api surface
  |              |- package.json     // optional - required when publishing package
  |              |- README.md        // required - how to use the package api
  |- src/
  |- package.json
```

## Tools and configuration

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
  |- packages/
  |- src/
  |- tsconfig-aot.json       // Angular AOT-Build Config for 'ngc'
  |- tsconfig.json           // TypeScript IDE config
  |- lerna.json              // Monorepo-Management with lernajs.io
  |- package.json            // Project manifest. Don't publish projects
  |- README.md               // Project basics and how to set up dev environment
```

### TypeScript

[TypeScript](https://www.typescriptlang.org) is *JavaScript with static typing*. TypeScript is *transpiled* into plain JavaScript at build-time using the *TypeScript Compiler (tsc)*. It applies type checking and if necessary provides
helpful messages if it infers any type constraint violations. TypeScript projects have a `tsconfig.json` which provide the compiler and IDEs with the necessary build params.

To build an *[Angular](https://angular.io/)* application we also need an additional `tsconfig-aot.json` file for configuring Angular's custom tsc-wrapper `ngc` which is optimized to transpile for Angular apps or libraries. You may only
need to touch this if you develop packages with more than one package scope in the same repo. In this case make sure  there's a path mapping for each scope.

### Building and Bundling with Webpack (Application Development)

TypeScript and Webpack are configured in a way that they can resolve package names in `node_modules/` *and* `packages/`. Apart from transplilation building an application usually requires many more steps in a build, e.g.

- checking source code against code qualitity rules (*linting*)
- combining multiple files into fewer files, e.g. combining JavaScript modules into *barrels*, *chunks* or *bundles*
- minifying static resources to reduce file sizes and speed up file transfer
- optimizing static resources, e.g. combining icons into *sprites* or *base64*-encoded strings
- transpiling stylesheets from CSS supersets like SASS or LESS into CSS
- etc.

Most of these steps can be set up using *[Webpack](https://webpack.js.org)* and Webpack-Plugins configured in `config/webpack.*.js` files.

Combining *all* resources into a single bundle is often not preferable, either due to license restrictions or for optimization reasons. Webpack supports *code splitting* which allows to split a code base into multiple *bundles*
or *chunks*. Our bundles for building an application are defined in `src/bundle-*.ts` files. There you should import any JavaScript modules acting as an entry module to Webpack's dependency resolution. Webpack will then include
any transitive dependencies. E.g. `bundle-app.ts` imports the bootstrap code for an Angular application. Transitive dependencies which are used in more than one chunk will be moved into a common chunk loaded before any dependent chunks.

### Unit Testing with Karma

Before we can run tests we need to build the application. Since build parameters can vary between a test environment and production environment, there is a separate webpack configuration `config/webpack.test.js`.

We use *[Karma](https://karma-runner.github.io)* as a *Test Runner*. It provides plug-ins for various testing frameworks like [Jasmine](https://jasmine.github.io) or [Mocha](https://mochajs.org/) as well as plug-ins for running tests in a
tests in a headless browser or instrumenting code to collect test coverage metrics. The relevant Karma configuration can be found in `config/karma.conf.js`.

Testing Angular projects with Karma and Webpack requires a routine to tell Karma where to find the test specifications and to bundle them up. This is done in `config/karma.shim.js`.

### End-to-End / UI-Testing with Protractor

[Protractor](http://www.protractortest.org) is a Test-Runner for UI-Tests similar
to Karma for Unit Tests. It assists with browser automation and provides tools
like `webdriver-manager` to manage the drivers needed to communicate with the
browsers. Customize its `config/protractor.js` to fit your testing requirements.

### Building individual packages with ng-packagr (Library Development)

Individual packages are built with [ng-packagr](https://github.com/dherges/ng-packagr).
Each package has a file `ng-package.json`.

### Publishing individual packages with Lerna (Library Development)

*[Lerna](https://github.com/lerna/lerna#readme)* helps with versioning packages
and preparing packages for release. Lerna is configured in `lerna.json`.
