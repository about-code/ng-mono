# Known Solutions

If you plan to modify the initial configuration there's always some risk of
running into errors where messages might not be self-explanatory or things stop
to work as expected. This page covers some errors we've come accross while
making the app template and what we have identified to be the reasons and
possible solutions.

**Module not found: Error can't resolve '[you-name-it].ngfactory'**

There is a [long list](https://github.com/angular/angular-cli/search?q=Can%27t+resolve+ngfactory&type=Issues&utf8=%E2%9C%93)
of issues related to that message. According to [this issue](https://github.com/angular/angular-cli/issues/6918#issuecomment-323810736)
in most cases the message isn't the actual error but a consequence of some error
in your code which prevents the AoT-compiler to generate the *ngFactory*-file it
is missing. Showing a more user-friendly and verbose error message is subject of
[issue 6918](https://github.com/angular/angular-cli/issues/6918#issuecomment-323810736)
in the Angular-CLI issue tracker.

Changes to configuration files which may cause the error:

- `tsconfig-aot.json`: when changing the angular compiler option `genDir` from
`"."` to something else, e.g. `"aot"`, then you must ensure that the import
paths to `.ngfactory` files, e.g. in the Angular bootstrap code (see
`main-aot.ts` in the *\*-app* package) also points to a path in *genDir*. But we
recommend *not* to change `genDir: "."`, because then `.ngfactory` files are
virtually generated right next to your *NgModule* source files which is the most
intuitive assumption in practice, even more since when building with
*@ngtools/webpack-AngularCompilerPlugin* you might not even be able to see
*genDir* or any temporary `.ngfactory` files in your source tree.
