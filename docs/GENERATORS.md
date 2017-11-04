# Writing Generators

Generators can be thought of as *gulp task* functions which return a promise. The
promise should resolve once the generator task has finished its scaffolding work.

> **Note:** By the term *generator* we refer to a design concept within this project,
not to the JavaScript language feature with the same name.

Generators use [Inquirer](https://github.com/SBoudrias/Inquirer.js) to ask
questions. Inquirer gives us answers in an answer object:

```javascript
 return inquirer.prompt([
        {type: "input",   name: "workspace", message: "Workspace:"},
        {type: "input",   name: "proj_name", message: "Project name (kebab-case):"},
 ])
 .then((answers) => {
    // map / compute further answers ...
    // configure subsequent processing steps
    const context = {
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
 .then(processSnippets) // optional
 .then(writeConfig);    // optional
```

The prompt's immediate `then()` callback is a good place where to calculate
derived answers and configuring subsequent *generator-steps*. The result of the
callback is a *context* object which holds the answers as well as the
configurations for each subsequent step in the `then()`-chain.

### Steps

If you're familiar with gulp then you might compare generator-tasks to an actual
gulp task function and steps to *micro-task* functions which are invoked as part
of the actual task. Step functions receive the context object and must return a promise which
resolves to the context object again. This contract enables generator steps
to be chained in `then()` function calls like shown in the example above.

### Summary:

In many cases generators will implement the following logical steps:

- Ask questions (interactive dialog)
- take an answer object and create a *context-object*...
    - ...with an `answers` key pointing on the user's answer object. If necessary derive further answers or transform existing answers.
    - ...optional: with config keys for subsequent tasks
- copy a template folder using `copyTemplate` task. Any `<%= ... %>` placeholders will be matched against `answers` and replaced if a key with the same name exists.
- optional: process snippet comments in selected source or config files to inject code statements based on user answers. Any `{{ ... }}` placeholders will be mateched against `answers` and replaced if a key with the same name exists.
- optional: persist the context object of the generator task to restore answers in subsequent generator executions. Note that only the latest answers will be kept, so in its current implementation it might not be a sufficient mechanism to be used for updating generated projects once a generator has changed.

