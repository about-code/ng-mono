# Writing Generators: Templates

There are two kinds of templates:

- *file templates*:
  these are files and folder structures in the `templates` folder of a generator
  task
- *snippet comments*:
  these are code templates ("snippets") in source files

Generators instantiate templates after having asked the user questions.
Instantiating file templates means copying them from the templates folder to a
*target directory* and replacing placeholders with a user's answers.

## Placeholder syntax

Use
- `<%= var_name %>` to replace non-snippet variables *in* template files *at the time of instantiating a file template*
- `{{var_name}}` to replace non-snippet variables in file names or folder names *at the time of instantiating a file template*.
- `{{var_name}}` to replace snippet variables *at the time of processing snippet comments*

## File Template Instantiation Rules

File templates can be instantiated by generators using the `copy-template`
generator step.

**Value `"foo"` for a variable `some_var`**

| Pattern        | Result
|----------------|-------------------------------|
| `{{some_var}}` | `foo`
| `path/to/{{some_var}}` | `path/to/foo`
| `path/to/{{some_var}}.txt` | `path/to/foo.txt`

**NO value for a variable `some_var`**

| Pattern        | Result
|----------------|-------------------------------|
| `template/{{some_var}}/README.md`  | `target/some_var/README.md`
| `template/{{+some_var}}/README.md` | `target/README.md`
| `template/{{-some_var}}/README.md` | subtree not copied

**Hidden / Dot-Files**

| Pattern        | Result
|----------------|-------------------------------|
| `_.gitignore`  | `.gitignore`

## Snippet Comment Instantiation Rules

Snippet comments can be instantiated by generators using the `process-snippets`
generator step. Snippet placeholders use the `{{...}}` syntax.

Snippet comments are identified by the character sequence `// :: ` or `/* :: `.
The colons may be followed by a number indicating how often a snippet can be
intantiated before it is removed. For example, the snippet
```js
   // ::1 var {{var_name}} = "Hello";
```
can be instantiated only once. Then its counter is reduced to 0 and it will be
removed after the snippet has been instantiated.

 > **Important** The colons and colon-counter-group must be surrounded by white spaces: `// ::1 baz` instad of e.g. `//::1 baz`.

The following comment can be instantiated two times:
```js
   // ::2 var {{var_name}} = "Hello";
```
Given the first answer for `var_name` was *foo* then after processing the
comment the first time will yield:
```js
   var foo = "Hello";
   // ::1 var {{var_name}} = "Hello";
```
Note that the counter has been reduced by one.

#### Arrays
Sometimes code generation requires to add entries into a collection.
```js
var arr = [
      // :: [,]{{var_name}}
];
```
In the example we've placed a snippet in an empty array definition; Since we
didn't provide a counter the comment may be instantiated more than once. We
indicate by a leading `[,]` that any snippet instantiation
*apart from the first one* must begin with a comma such that when snippets are
instantiated repeatedly we will yield something like
```js
var arr = [
     foo
     // :: ,{{var_name}}
];
```
You see that `[,]` will be replaced with `,` after the very first instantiation
causing any further instantiation to begin with a leading comma.

**Instantiation algorithm:**
The snippet instantiation algorithm roughly works as follows (Pseudocode):

   - find snippet comments in files matching a Glob pattern
   - for each comment
     - copy comment to RAM
     - strip comment escape symbols ("instantiate it")
     - replace variables/placeholders in the instantiated code snippet ("initialize it")
     - if the snippet comment in RAM has an instantiation counter
       - then reduce the instantiation counter by one
     - if the snippet comment has no instantiation counter or a counter value greater than zero
       - insert the snippet comment again below the snippet instance
