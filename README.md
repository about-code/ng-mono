# ng-mono

A generator to help setting up an [Angular](https://angular.io) multi-package
application or library project with [monorepo](https://github.com/lerna/lerna)
structure. Sample can be found [here](https://github.com/about-code/ng-mono-sample).

## Installation

```
npm install -g git+https://github.com/about-code/ng-mono.git
```

## Synopsis
```
ng-mono
```

Generators:

- `Project`
- `Package / Library`
- `Module` (NgModule)
- `Component` (NgComponent)

> **Important**: Any generator apart from `Project` assumes the command's *working directory* is your project root directory.

## Quickstart

Let's setup a project with a feature package, an *NgModule* and an *NgComponent*.

### Setting up the project

```
ng-mono

> Project
  Package
  Module
  Component
```

Provide the following answers:
- Project name: **my-foo**
- App context root (use leading slash): **/**
- Title to use in browser tabs: **My Foo Application**
- NPM Package Scope (see important note below): **@foo**
- Short project description: **A scalable Angular2 application setup**
- Initial version: **1.0.0**
- Authorship: **anonymous**
- Ready: **y**

> **Note:** In the generated app you'll find a document `docs/FILES.md` explaining
the project directories and a few important config files.

> **Important:** `ngc` requires a path mapping for npm package scopes in the
> generated `tsconfig*.json`. The scope provided upon project setup will be
> added automatically. Other generators below allow to create additional package
> scopes but currently can't add a `paths` mapping in `tsconfig*.json`. If
> you generate packages with different package scopes than provided to the *Project*
> generator, make sure to manually provide a mapping for each scope in
> `tsconfig*.json` files.

Running the app
```
cd my-foo  // subsequent commands must be run from the project root
npm start
```
You should now be able to navigate to http://localhost:8080/ and see a welcome
message. Cancel with Ctrl+C and type
```
npm run develop
```
to start an unminified debuggable version.

### Creating a feature package

We assume you're in your *project root* now.

> **Tip:** We recommend using `git` and committing everytime before running a generator.
> Not only does it help to find out which files were modified by a generator (`git diff`).
> It also helps reverting when something went wrong. If you already have `git` installed
> run `git init` now to create a git repo and then `git commit -am "Initial commit"`.

```
ng-mono

  Project
> Package / Library,
  Module
  Component
```
Provide the following answers:
- NPM Package name: **@foo/my-foo-feature**
- Short project description: **This feature provides foo capabilities**
- Initial version: **1.0.0**
- Authorship: **anonymous**
- Ready: **y**

You should now have a new package *@foo/my-foo-feature* in *./packages* which
adheres to a minimal layout of a TypeScript NPM package. Run `npm run build-pkg`
from the project root to build publishable versions of the packages.

### Creating and exporting an NgModule from a feature package
```
ng-mono

  Project
  Package / Library,
> Module
  Component
```
Provide the following answers:
- Module class name: **FooFeatureModule**
- Target package (Feature package): **@foo/my-foo-feature**
- Should the target package export the module class? **y**
- Ready: **y**

You will find the newly created NgModule in the *src* directory of the feature
package. Also have a look at *index.ts*. Its exported there.

**What next?**
We just created an NgModule but didn't import it anywhere. You might want to import
it now manually into your *AppModule.ts*. Use
```
import {FooFeatureModule} from "@foo/foo-feature"
```
to ES-import the module class and add `FooFeatureModule` to the `imports`-Section
of the `@NgModule` decorator.

> **Note:** By ES-importing from *@foo/foo-feature* you created a hard dependency
> between *@foo/foo-app* and *@foo/foo-feature*. Add *@foo/foo-feature* to the
> `dependencies` section of *foo-app's* `package.json`. You *could* omit this
> step and your project would still build. However, if you later want to publish
> a package an incomplete list of dependencies could cause a bug for third-party
> consumers.

### Creating an NgComponent
```
ng-mono

  Project
  Package / Library,
  Module
> Component
```
Provide the following answers:
- Component class name (CamelCase): **FooComponent**
- Component Selector (kebab-case): **foo-component**
- Component route (all lowercase): **foo**
- Target package (Feature Package): **@foo/foo-feature**

**What next?**
We now created an NgComponent but don't use it anywhere in a template, so far.
You should have already imported `FooFeatureModule` into `foo-app/src/AppModule.ts`.
Now update `foo-app/src/app/AppComponent.html` such that it uses your generated
`NgComponent`. Then build and try navigating to `http://localhost:8080/foo/`.
