**This project has been archived.** Since Angular v6 Angular-CLI supports *libraries* which can be developed alongside an app in a monorepo. Fortunately, with this feature it officially supports a development model and project layout *ng-mono* had it in mind at a time the CLI was not as mature as it is today, that is: building medium-sized to larger apps from *reusable, maintainable, shippable packages*. These allow leveraging package managers and package registries as well as importing ES modules from well-defined package exports rather than spreading relative import paths accross a large codebase thereby violating good practices of software design. Packages/Libraries are key to structuring medium-sized and large Angular apps since they mean true modularization beyond *NgModules* right down to the package-level.

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

Let's set up a [sample project](https://github.com/about-code/ng-mono-sample)
with a feature package, an *NgModule* and an *NgComponent*.

### Setting up the project

```
ng-mono

> Project
  Package
  Module
  Component
```

Provide the following answers:
- Project name: **ng-mono-sample**
- App context root (use leading slash): **/**
- Title to use in browser tabs: **ng-mono-sample**
- NPM Package Scope (see important note below): **@foo**
- Short project description: **Sample project generated with https://github.com/about-code/ng-mono**
- Initial version: **1.0.0**
- Authorship: **anonymous**
- Generate app and theme package? **y**
- Immediately install dependencies? **y**
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
cd ng-mono-sample  // subsequent commands must be run from the project root
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
- NPM Package name: **@foo/foo-feature**
- Short project description: **Demo of a feature package**
- Initial version: **1.0.0**
- Authorship: **anonymous**
- Ready: **y**

You should now have a new package *@foo/foo-feature* in *./packages* which
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
- Module class name: **FeatureModule**
- Target package (Feature package): **@foo/foo-feature**
- Should the target package export the module class? **y**
- Ready: **y**

You will find the newly created NgModule in the *src* directory of the
*@foo/foo-feature* package. Also have a look at *index.ts*. Its exported there.

**What next?**
Up to now created a feature package with an NgModule export but didn't import this
feature in our main app module. You might want to import it now manually into
your *AppModule.ts*. Use
```
import {FeatureModule} from "@foo/foo-feature"
```
to ES-import the module class and add `FeatureModule` to the `imports`-Section
of the `@NgModule` decorator.

By ES-importing from *@foo/foo-feature* you created a dependency between *@foo/ng-mono-sample-app* and *@foo/foo-feature*. Add *@foo/foo-feature* to the `dependencies` section of *ng-mono-sample-app's* `package.json`:

```js
{
   name: "@foo/ng-mono-sample-app"
   //...
   dependencies: {
      "@foo/foo-feature": "*"
   }
}
```
Since we're in the midth of developing our app we are likely to have frequent
changes of the feature packages. Specify versions for these packages with an `*`
version so your app feature always depends on the latest version of the
*foo-feature* package.

> **Note:** You can do this also for dependencies of feature packages, which
> it shares with the overall project. E.g. you should declare concrete versions
> of Angular dependencies in the project manifest and use the asterisk specifier
> for dependencies declared in feature packages.

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
- Component Selector (kebab-case): **foo-comp**
- Component route (all lowercase): **foo**
- Target package (Feature Package): **@foo/foo-feature**

The component was automatically declared in the `@NgModules` metadata section of
*@foo/foo-feature/src/FeatureModule.ts* and its component route was added to
*RouteModule.ts* in the same package. Since you have already imported
`FeatureModule` into `@foo/ng-mono-sample-app/src/AppModule.ts` in the
previous step you can rebuild the project (if you didn't watch with `npm run develop`)
and directly navigate to `http://localhost:8080/foo/`.

**Where to go next?**

Your sample project should look like [ng-mono-sample](https://github.com/about-code/ng-mono-sample) now.
We have created a project which shows how to setup an Angular project with a
mono-repo project structure. Have a look at the `README.md` of the sample project.
It describes how to proceed with advanced workflows such as testing or building
and publishing your feature packages to share them with others.
