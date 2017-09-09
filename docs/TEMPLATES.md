# Templates

Templates are files and folder structures in the `/templates` folder. In order
to instantiate them, they will be copied from the templates folder to a *target
directory*. While being copied template files are being processed in order to
incorporate answers previously given by a user.

The target directory where the template files are copied to is assumed to be
inside a *workspace* directory. By default *slush-ng-monorepo* assumes it has
been cloned into the workspace directory so when asking for the workspace it
suggests its parent directory `../` by default.

### Placeholder syntax

Use
- `<%= var_name %>` to replace a variable *once at instantiation* time
- `{{var_name}}` to replace a variable *inside a snippet comment*
- `{{var_name}}` to replace a variable *in a file or folder name*.

### File renaming rules

**... with an answer 'foo' for a variable 'some_var'**

| Pattern        | with answer "foo" for `some_var`
|----------------|-------------------------------|
| `{{some_var}}` | `foo`
| `path/to/{{some_var}}` | `path/to/foo`
| `path/to/{{some_var}}.txt` | `path/to/foo.txt`

**... without an answer for `some_var`**

| Pattern        | Resu
|----------------|-------------------------------|
| `template/{{some_var}}/README.md`  | `target/some_var/README.md`
| `template/{{+some_var}}/README.md` | `target/README.md`
| `template/{{-some_var}}/README.md` | not copied.

**... hidden files**

| Pattern        | Copy
|----------------|-------------------------------|
| `_.gitignore`  | `.gitignore`


### Snippet comments (TBD)


## Writing or customizing templates

We use [inquirer](github.com/) to ask questions. Answers will be written into
variables.

```javascript
 return inquirer.prompt([
        {type: "input",   name: "workspace", message: "Workspace:"},
        {type: "input",   name: "proj_name", message: "Project name (kebab-case):"},
 ])
 .then((answers) => {
    // map / compute further answers ...
    // configure subsequent processing steps
 })
 .then(copyTemplate)
 .then(processSnippets);
```

Based on answers by a user we may compute further answers. Computation and mapping
happens inside the inquirer callback prior to copying and processing the templates.
When all answers are computed a template can be copied and placeholders
replaced.
