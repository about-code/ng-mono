# <%= pkg_fullname %>

<%= pkg_description %>

# How to build for publishing as a node package

```
npm install
npm run build
```

# How to consume in your app

## Import via ECMAScript Module Syntax

```
import {Foo} from "<%= pkg_fullname %>";
```

## When bundling your app with Webpack...

Webpack will resolve ES-Module imports automatically.

## When bundling your app with Rollup...

See [Rollup Docs](https://rollupjs.org/#using-rollup-with-npm) on how to use Rollup with npm packages.

## When loading an unbundled app in the browser via SystemJS module loader..

We assume a directory structure
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
with `index.html` at the root of a directory which is served from a
context root `/your-context-root`.  The SystemJS configuration in `index.html`
may use the `map` configuration to map `<%= pkg_fullname %>` to the UMD version
of the lib.

```javascript
System.config({
    baseURL: '/your-context-root/node_modules',
    map: {
        '<%= pkg_fullname %>': '<%= pkg_fullname %>/dist/<%= pkg_fullname %>.es5.umd.js'
    }
    ...
});
```

# Further Reading
- Building Angular Libraries (https://www.youtube.com/watch?v=unICbsPGFIA)
