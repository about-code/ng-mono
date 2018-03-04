# <%= pkg_fullname %>

<%= pkg_description %>

## Usage

### Installation (package consumers)

```
npm install <%= pkg_fullname %>
```

### Consuming the package (package consumers)

Importing the API (assuming a class `Foo` being exported)
```
import {Foo} from "<%= pkg_fullname %>";
```

Depending on how the application which consumes the package will be built, additional steps might be necessary when using the package.

#### Bundling with [Webpack](https://webpack.js.org)

  Webpack doesn't require special configuration to resolve ES2015 import syntax. Just import the package like shown above.

#### Bundling with [Rollup](https://rollupjs.org)

  See Rollup Docs on how to use [Rollup with npm packages](https://rollupjs.org/#using-rollup-with-npm).

#### Lazy loading the package with [SystemJS](https://github.com/systemjs/systemjs) module loader

On the server we assume a filesystem for when the package was published in *Angular Package Format* (see package developer guide below):

```
${WEB_ROOT}
    |- node_modules
    |       |-<%= pkg_scope %>
    |              |- <%= pkg_name %>
    |                     |- dist
    |                          |- <%=pkg_scope %>
    |                                  |- <%= pkg_name %>.es5.umd.js
    |- index.html
```

`index.html` is assumed to be at *document root*. The URL from which `index.html` is served is assumed to be `http://example.com/my-app`.  The SystemJS configuration in `index.html` may use the `map` configuration to map imports of `<%= pkg_fullname %>` to the UMD bundle of the lib. SystemJS was configured via `baseURL` to resolve absolute paths relative to the URL `/my-app/node_modules`. That means `node_modules` must be within the document root but should contain production dependencies, only.

```javascript
System.config({
    baseURL: '/my-app/node_modules',
    map: {
        '<%= pkg_fullname %>': '<%= pkg_fullname %>/dist/<%= pkg_fullname %>.es5.umd.js'
    }
    ...
});
```

### Building and publishing the package (package developers)

> **Note:** These instructions assume the package is developed in its own
repository. If it is developed within a monorepo the build instructions for the
monorepo may describe an alternative workflow.

There are two build options which you might choose from

- `npm run tsc`

  Transpiles the package sources with the TypeScript compiler (tsc) and produces a `/dist` folder with unbundled JavaScript, Type Declarations (d.ts) and Source Maps (.map).

  This may be appropriate if you have a utility package with few requirements on build optimization. After building the package you may want to try `npm pack` first to see what will be published with `npm publish`.

- `npm run ng-packagr`

  Builds the package with [ng-packagr](https://github.com/dherges/ng-packagr/) and creates a `/dist` folder in Angular Package Format.

  This may be appropriate if you have a utility package which you want to bundle for different consumption patterns like described in [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/edit?_escaped_fragment_&usp=embed_facebook) or if your package exports Angular framework concepts like `NgModule` or `NgComponent` classes. Run `npm pack` and `npm publish` *inside* the `/dist` folder.
