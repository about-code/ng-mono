# Files and Directories

The project layout promotes a framework-agnostic *[monorepo](https://github.com/lerna/lerna#readme)*
structure which makes it easy
- to develop a modular application from multiple npm packages
- to develop libraries with an application test-bed

The structure was chosen with the following goals in mind:

- developing an application should be a process of developing npm-style *packages* (*libraries*).
- the majority of an apps code base should live in packages which adhere to modularity best practices such as the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle).
- common concerns needed repeatedly in app projects should be *reusable* as a package
- app developers should be able to create and consume their packages from the beginning as if they have been installed via `npm` even though, the package in its incubation phase might be consumed from a `/packages` source folder. Consuming it like an npm package guarantees that when a package leaves its incubation phase and when it should be maintained accross development teams it can be extracted from its incubator app's source tree. It can then be maintained in its own repository and installed from an npm registry without changes the source code of its incubator app (import paths).


## Project Structure Explained

```
${PROJECT_HOME}
  |- packages/                  // home of your packages and modules
  |- scripts/                   // some scripts called via  `npm run ...` commands
  |- src/                       // application shell (index.html and entry bundles)
  |    |- bundle-app.ts         // entry bundle importing the main module in the app package
  |    |- bundle-polyfills.ts   // entry bundle importing polyfills (browser compatibility layer)
  |    |- bundle-theme.ts       // entry bundle importing the main sass file
  |    |- bundle-vendor.ts      // entry bundle importing vendor libs
  |    |- index.html
  |
  |- package.json               // project manifest
  |- tsconfig.json              // TypeScript configuration
  |- ...
```

The `src/` folder contains the application shell. It is required when developing and bundling an application but may also be used as a test-bed when developing libraries. When bundling external libraries or polyfills within an application, then import them into `bundle-vendor.ts` or `bundle-polyfills.ts` (see e.g [angular.io](https://angular.io))

## Packages and Library Development

Feature packages (e.g. *my-foo-feature*) **should** be structured according to NPM
package best practices. They live inside the *packages* folder. We suggest a
structure like the one below for [scoped packages](https://docs.npmjs.com/getting-started/scoped-packages).
```
${PROJECT_HOME}
  |- packages/
  |    |- @scope/                    // Optional name of a package scope
  |        |- my-foo-app/            // Your app package
  |        |- my-foo-feature/        // your feature packages
  |              |- src/             // required - the actual package source code
  |              |- index.ts         // required - facade moudle with public api surface
  |              |- .npmignore       // optional - may be required when publishing package
  |              |- .gitignore       // optional - may be required when moving to a separate repo
  |              |- LICENSE.txt      // optional - required when publishing a package
  |              |- ng-package.json  // optional - ng-packagr config to build a package for publishing
  |              |- package.json     // optional - required when publishing package
  |              |- README.md        // required - how to use the package api (see note below)
  |- ...
```
 A package **must** exhibit a *facade module* (index.{ts|mjs}) which exports a package's public API. Package consumers **must not** import modules which were not (re-)exported by the facade module. Otherwise they are reaching out into the package's *private* API.

 > The project's `tsconfig.json` is configured in a way that it enables VSCode's auto-import feature to correctly resolve the package name if you attempt to import an export of e.g. *my-foo-feature* in *my-foo-app*. If VSCode doesn't resolve the package name `@foo/my-foo-feature` but a *relative* path across the boundary of *my-foo-app*, e.g. `../../my-foo-feature/src/FooClass` then this is a **strong indication** that the class being imported by *my-foo-app* wasn't exported by the facade module of *my-foo-feature*. You should then either add *FooClass* to *my-foo-feature*'s public API or rethink if you really want to violate the public contract.

> **Note** The `README.md` of feature packages should be written as if the package would be developed separately in its own repository. However, as long as it is developed within a monorepo project structure, the build instructions of the monorepo project should be considered first.

## Toolchain and Configuration Files

Developing an application requires a good amount of different tools each with their own configuration. Many of these tools are configured to lookup their config in the project root (${PROJECT_HOME}) by default. However we've seen projects with a mass of tool configs, scripts and other files on that level (which happens when you need to replicate configs for running the tools in different environments, e.g locally on the developer-machine and remotely on a build-server or when running e2e tests locally and against some remote deployment).

From this lesson we learned that it is better to have a *config* folder - if necessary with subfolders for the different environments - and not to clutter the project root.

```
${PROJECT_HOME}
  |- config/
  |    |- karma.conf.js          // Karma Test Runner Config (Unit Tests)
  |    |- karma.shim.js          // Karma-Angular-Webpack Integration
  |    |- protractor.js          // Protractor Test Runner Config (E2E-Tests)
  |    |- webpack.common.js      // Common Bundling Params
  |    |- webpack.dev.js         // Development-Time Bundling (e.g. no minifcation)
  |    |- webpack.prod.js        // Production-Build Bundling
  |    |- webpack.server.js      // Development server and proxy configuration
  |    |- webpack.test.js        // Test-Build Bundling
  |
  |- packages/
  |- src/
  |- tsconfig.json           // TypeScript compiler and Angular AOT-compiler options
  |- lerna.json              // Monorepo-Management with lernajs.io
  |- package.json            // Project and development dependency definition
  |- README.md               // Instructions on how to set up the project development environment
```

### TypeScript

[TypeScript](https://www.typescriptlang.org) is *JavaScript with static typing*. TypeScript is *transpiled* into plain JavaScript at build-time using the *TypeScript Compiler (tsc)*. It applies type checking and if necessary provides
helpful messages if it infers any type constraint violations. TypeScript projects have a `tsconfig.json` which provide the compiler and IDEs with the necessary build params.

To build an *[Angular](https://angular.io/)* application the TypeScript config file is extended with additional `angularCompilerOptions` for Angular's custom tsc-wrapper named `ngc` which generates Angular support files while transpiling the TypeScript code.

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

### Building individual packages with ng-packagr (Library Development)

Individual packages are built with [ng-packagr](https://github.com/dherges/ng-packagr).
Each package has a file `ng-package.json`.

### Publishing individual packages with Lerna (Library Development)

*[Lerna](https://github.com/lerna/lerna#readme)* helps with versioning packages
and preparing packages for release. Lerna is configured in `lerna.json`.

### Unit Testing with Karma

Before we can run tests we need to build the application. Since build parameters can vary between a test environment and production environment, there is a separate webpack configuration `config/webpack.test.js`.

We use *[Karma](https://karma-runner.github.io)* as a *Test Runner*. It provides plug-ins for various testing frameworks like [Jasmine](https://jasmine.github.io) or [Mocha](https://mochajs.org/) as well as plug-ins for running tests in a headless browser. It further supports instrumenting code to collect test coverage metrics. The relevant Karma configuration can be found in `config/karma.conf.js`.

Testing Angular projects with Karma and Webpack requires a routine to tell Karma where to find the test specifications and to bundle them up. This is done in `config/karma.shim.js`.

### End-to-End / UI-Testing with Protractor

[Protractor](http://www.protractortest.org) is a Test-Runner for UI-Tests similar
to Karma for Unit Tests. It assists with browser automation and provides tools
like `webdriver-manager` to manage the drivers needed to communicate with the
browsers. Customize its `config/protractor.js` to fit your testing requirements.
