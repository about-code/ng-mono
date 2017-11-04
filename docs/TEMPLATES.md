# Writing Generators: Templates

Templates are files and folder structures in the `templates` folder of a generator
task. Generators instantiate them after having asked the user questions.
Instantiating templates means copying them from the templates folder to a
*target directory* and replacing placeholders with a user's answers.

### Placeholder syntax

Use
- `<%= var_name %>` to replace a variable *once at instantiation* time
- `{{var_name}}` to replace a variable *in a file name or folder name*.
- `{{var_name}}` to replace a variable *inside source files and snippet comments*

### File renaming rules

**... with an answer 'foo' for a variable 'some_var'**

| Pattern        | with answer "foo" for `some_var`
|----------------|-------------------------------|
| `{{some_var}}` | `foo`
| `path/to/{{some_var}}` | `path/to/foo`
| `path/to/{{some_var}}.txt` | `path/to/foo.txt`

**... without an answer for `some_var`**

| Pattern        | Result
|----------------|-------------------------------|
| `template/{{some_var}}/README.md`  | `target/some_var/README.md`
| `template/{{+some_var}}/README.md` | `target/README.md`
| `template/{{-some_var}}/README.md` | not copied.

**... hidden files**

| Pattern        | Copy
|----------------|-------------------------------|
| `_.gitignore`  | `.gitignore`

### Snippet Comments

Files in a target directory may contain *snippet comments*. These are code
comments which provide a code snippet. Snippet comments can be instantiated
by generators using the `process-snippets` generator step. Snippet itself may
have placeholders using the `{{...}}` placeholder syntax.

Snippet comments are identified by the character sequence `// :: ` or `/* :: `.
The colons may be followed by a number indicating how often a snippet can be
intantiated before it is removed. For example, the snippet
```js
   // ::1 var {{var_name}} = "Hello";
```
can be instantiated only once. Then its counter is reduced to 0 and it will be
removed after the snippet has been instantiated.

 > **Important*** Colons or colons+counter must be wrapped by white spaces.

In contrast to above snippet the following comment
```js
   // ::2 var {{var_name}} = "Hello";
```
can be instantiated two times. Given the first answer for `var_name` was *foo*,
then after processing the comment the first time, the result will be
```js
   var foo = "Hello";
   // ::1 var {{var_name}} = "Hello";
```
Note that the counter has been reduced by one.

# Arrays
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
