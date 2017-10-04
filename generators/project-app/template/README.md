# <%= proj_pkg_fullname %>

<%= pkg_description %>

## App development

- Build and serve production build: `npm start`
- Build and serve development build: `npm run debug`
- Build production bundle: `npm run build`


## Library development (TBD)

- Build packages compatible to [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview):
  `npm run build-pkg`

> **Note:** The package build script uses [ng-packagr](https://github.com/dherges/ng-packagr)
under the hood. If you have issues building packages (e.g. packages with third-party
dependencies) have a look at [ng-packagr](https://github.com/dherges/ng-packagr)
docs for details on how to configure `ng-packagr` via `ng-package.json` of the
respective package.

## Testing

### End-To-End / UI-Testing

1. Before you run tests the very first time:  `npm run webdriver-manager update`
1. Run Application (console 1): `npm start`
1. Run Selenium Server locally (console 2): `npm run selenium`
1. Run Tests locally (console 3): `npm run test-e2e`
