# Known Issues

**Module not found: Error can't resolve '[you-name-it].ngfactory'**

There is a [long list](https://github.com/angular/angular-cli/search?q=Can%27t+resolve+ngfactory&type=Issues&utf8=%E2%9C%93)
of issues related to that message. According to [this issue](https://github.com/angular/angular-cli/issues/6918#issuecomment-323810736)
the message most often is a result of errors in your code where the actual compiler
error message got lost. Due to the compile error `ngc` doesn't generate an
`.ngfactory` which is why it eventually complains about the missing module.
Not losing the actual error message in case of compile errors is
[an open issue](https://github.com/angular/angular-cli/issues/6918#issuecomment-323810736)
in Angular-CLI tooling, at the time of writing.

Changes to configuration files which may cause above error:
- `tsconfig-aot.json`: when changing `"genDir"` angular compiler option from `"."`
 to something else e.g. `"aot"`, then you must ensure that the import paths to
 `.ngfactory` files of NgModules, e.g. in your Angular bootstrap code (by
 default `main-aot.ts`), also point to a path in *genDir*. We therefore recommend
 not to change the default option. Then `.ngfactory` files are generated right
 next to your *NgModule* source files which is the most intuitive assumption in
 practice, even more so, since when building with *@ngtools/webpack-AotPlugin*
 you might not even be able to see *genDir* or temporary `.ngfactory` files in
 your source tree.
