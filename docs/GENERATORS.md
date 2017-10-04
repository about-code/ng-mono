# Generators

Generators are functions which return a promise that resolves once the generator
has finished its scaffolding work.

> **Note:** By the term *generator* we refer to a design concept within this project,
not to the JavaScript language feature with the same name.

## Writing generators

Generator logic typically comprises a few common logical steps:

- Ask questions (interactive dialog)
- take an answer object and create a context-object
    - with an `answers` key pointing on the user's answer object. If necessary derive further answers or transform existing answers.
    - optional: with config keys for subsequent tasks
- copy a template folder using `copyTemplate` task. Any `<%= ... %>` placeholders will be matched against `answers` and replaced if a key with the same name exists.
- optional: process snippet comments in selected source or config files to insert statements based on user answers. Any `{{ ... }}` placeholders will be mateched against `answers` and replaced if a key with the same name exists.

We use [inquirer](github.com/) to ask questions. Answers will be written into
properties of an answer object.

```javascript
 return inquirer.prompt([
        {type: "input",   name: "workspace", message: "Workspace:"},
        {type: "input",   name: "proj_name", message: "Project name (kebab-case):"},
 ])
 .then((answers) => {
    // map / compute further answers ...
    // configure subsequent processing steps
    let context = {
        answers: answers,
        copyTemplate: {
            //...
        },
        processSnippets: {
            // ...
        }
    }
    return context;
 })
 .then(copyTemplate)
 .then(processSnippets);
```
