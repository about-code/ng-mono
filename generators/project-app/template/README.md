# <%= proj_pkg_fullname %>

<%= pkg_description %>

## Installing

- get the sources from version control
- `cd` into project folder
- run `npm install`

## Building and bundling an app from packages

- build optimized production bundle: `npm run build`
- build and serve optimized production build: `npm run build-serve`
- build and serve debuggable development build: `npm start`

### Building packages for reuse

With this structure in place packages can be built compatible to [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview) using:
  `npm run build-pkg`

> **Note:** The package build script uses [ng-packagr](https://github.com/dherges/ng-packagr) under the hood. You might need to tweak `ng-package.json` based on your requirements and external package dependencies. If you have issues building packages (e.g. packages with third-party dependencies) have a look at [ng-packagr](https://github.com/dherges/ng-packagr) and its docs.

### Publishing (Not yet fully tested)

Use `npm run lerna -- publish` to version packages (see [lernajs.io](https://lernajs.io)). Unless you develop for node **don't run** `lerna bootstrap` even if its said to be crucial. It links packages which is crucial for node development but not required if you build an Angular web app which gets bundled with webpack. Symlinks might even cause more problems with webpack than they solve.

> **Note:** Edit `lerna.json` to change from individual-version strategy to a common-version strategy

## Testing

### Unit Testing

- Run Karma Unit Tests with `npm run test`
- **Convention:** Unit test specs must end with `.spec.ts`
- **Note:** To choose other browsers or customize the setup edit `config/karma.conf.js`.

### End-To-End / UI-Testing

1. Before you run tests the very first time:  `npm run webdriver-manager update`
1. Run Application (console 1): `npm start`
1. Run Tests locally (console 2): `npm run test-e2e`

- **Convention:** E2E test specs must end with `-e2e.ts`
- **Note:** To customize the setup edit `config/protractor.js`.

## Further Reading
- Building Angular Libraries (https://www.youtube.com/watch?v=unICbsPGFIA)
