# <%= pkg_fullname %>

<%= pkg_description %>

## Usage

### Installation

```
npm install <%= pkg_fullname %>
```

Importing the API (assuming a class `Foo` being exported)
```
import {Foo} from "<%= pkg_fullname %>";
```

### Options to bundle or load the package

- Bundling with [Webpack](https://webpack.js.org)

  Webpack doesn't require special configuration to resolve ES2015 import syntax.

- Bundling with [Rollup](https://rollupjs.org)

  See Rollup Docs on how to use [Rollup with npm packages](https://rollupjs.org/#using-rollup-with-npm).

- When loading the package lazily with [SystemJS](https://github.com/systemjs/systemjs) module loader

    On the server we assume a directory structure
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
    where `index.html` is at *document root*. The URL from which `index.html` is served is assumed to be
    `http://example.com/my-app`.  The SystemJS configuration in `index.html`
    may use the `map` configuration to map `<%= pkg_fullname %>` to the UMD version
    of the lib.

    ```javascript
    System.config({
        baseURL: '/my-app/node_modules',
        map: {
            '<%= pkg_fullname %>': '<%= pkg_fullname %>/dist/<%= pkg_fullname %>.es5.umd.js'
        }
        ...
    });
    ```
