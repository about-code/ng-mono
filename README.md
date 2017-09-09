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

`slush ng-monrepo` runs the default generator `project` and is equivalent to running `slush ng-monorepo:project`.
Other available generators:

- project
- package
- module
- component


## Quickstart

Let's setup a project with a feature package, an *NgModule* and an *NgComponent*.

### Setting up the project

```
mkdir project
cd project
slush ng-monorepo
```
Provide the following answers:
- Workspace directory: **.**
- Project name: **my-foo**
- Title to use in browser tabs: **My Foo Application**
- NPM Package Scope: **@foo**
- Short project description: **A scalable Angular2 application setup**
- Initial version: **1.0.0**
- Authorship: **anonymous**
- Ready: **y**

Running the app
```
npm start
```
You should now be able to navigate to http://localhost:8080/ and see a welcome
message.

```
npm run develop
```

> Note: In the generated app you'll find a document `docs/FILES.md` explaining the most
important files.


### Creating a feature package
```
slush ng-monorepo:package
```
Provide the following answers:
- Workspace: **../**
- Project name: **my-foo**
- NPM Package name: **@foo/my-foo-feature**
- Short project description: **This feature provides foo capabilities**
- Initial version: **1.0.0**
- Authorship: **anonymous**
- Ready: **y**

You should now have a new package in *../my-foo/packages* which adheres to a minimal
layout of a TypeScript NPM package. Next we will add an NgModule and make the
feature package export it.

### Creating and exporting an NgModule by a feature package
```
slush ng-monorepo:module
```
Provide the following answers:
- Workspace: **../**
- Project name: **my-foo**
- Target package (Feature package): **@foo/my-foo-feature**
- Target directory in target package: **./src**
- Module-Class Name (without -Module suffix): **FooFeature**
- Should the target package export the module class? **y**
- Ready: **y**

You will find the newly created NgModule in the *src* directory of the feature package.
Also have a look at *index.ts*. Its exported there.

> You should see that *NgModules* while helping to structure an angular application into modules
don't provide any means of versioning. Only by exporting NgModules via npm packages
we get
> - true modularization
> - powerful dependency management and tooling
> - a true module facade (index.ts) which can be imported into external ES-Modules using the package name rather than relative paths which reveal the packages internal structure.
