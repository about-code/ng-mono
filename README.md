# slush-ng-monorepo

A Slush generator to help setting up a scalable Angular2+ application project
where an application is structured and built from multiple npm packages
(feature packages).

## Installation

```
npm install -g slush git+https://github.com/about-code/slush-ng-monorepo.git
```

## Synopsis
```
slush ng-monorepo[:generator]
```

`slush ng-monrepo` provides you with a selection of available generators:

- Project
- Package
- Module (NgModule)
- Component (NgComponent)

> **Important**: Any command apart from 'project' assumes you're in the generated
project folder at project root.

## Quickstart

Let's setup a project with a feature package, an *NgModule* and an *NgComponent*.

### Setting up the project

```
slush ng-monorepo
```

Provide the following answers:
- Project name: **my-foo**
- Title to use in browser tabs: **My Foo Application**
- NPM Package Scope: **@foo**
- Short project description: **A scalable Angular2 application setup**
- Initial version: **1.0.0**
- Authorship: **anonymous**
- Ready: **y**

Running the app
```
cd my-foo  // IMPORTANT: any further commands must be run from the project root
npm start
```
You should now be able to navigate to http://localhost:8080/ and see a welcome
message. Cancel with Ctrl+C and type
```
npm run develop
```
to start an unminified debuggable version.

> Note: In the generated app you'll find a document `docs/FILES.md` explaining
the projects directory layout and most important config files.

### Creating a feature package

**Once again: we assume you're at your *project root***

```
slush ng-monorepo:package
```
Provide the following answers:
- NPM Package name: **@foo/my-foo-feature**
- Short project description: **This feature provides foo capabilities**
- Initial version: **1.0.0**
- Authorship: **anonymous**
- Ready: **y**

You should now have a new package *@foo/my-foo-feature* in *./packages* which
adheres to a minimal layout of a TypeScript NPM package.

At this point you may want to try [ng-packagr](https://github.com/dherges/ng-packagr):
```
npm install -g ng-packagr
cd ./packages/@foo/my-foo-feature
ng-packagr
```
Running *ng-packagr* in a package builds the package according to
[Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview).

> If you want to publish a package you currently have to run the ng-packagr
command in each package. Building all packages with a single command is a
long-term goal.

```
cd ../../../
```

### Creating and exporting an NgModule by a feature package
```
slush ng-monorepo:module
```
Provide the following answers:
- Module-Class Name (without -Module suffix): **FooFeatureModule**
- Target package (Feature package): **@foo/my-foo-feature**
- Package-internal path (./src/...): **/**
- Should the target package export the module class? **y**
- Ready: **y**

You will find the newly created NgModule in the *src* directory of the feature
package. Also have a look at *index.ts*. Its exported there.

**What's next?`**
We've created an NgModule but didn't import it anywhere. You might want to import
it now into your *AppModule*. You should see that *NgModules* help
organizing an Angular application into modules but don't provide any means of
versioning. Only with npm packages we get
- true modularization
- powerful dependency management and tooling
- a true module facade (index.ts) which can be imported into external ES-Modules
using the package name rather than relative paths which reveal the packages
internal structure.
