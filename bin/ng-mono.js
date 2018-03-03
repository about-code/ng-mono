#! /usr/bin/env node

let process = require("process")
    ,path = require("path")
    ,inquirer = require("inquirer")
    ,pkg = require("../package.json")
    ,generatorProject   = require("../generators/project-app/generator")
    ,generatorPackage   = require("../generators/package-feature/generator")
    ,generatorModule    = require("../generators/class-ng-module/generator")
    ,generatorComponent = require("../generators/class-ng-component/generator");

console.log(`
${pkg.name} ${pkg.version}
------------------------------------------------`);
applyArguments();
return inquirer
    .prompt([{type: "list", name: "goal", message: "What do you want to generate?", choices: [
            "Project",
            "Package / Library",
            "Module",
            "Component"
        ]}
    ])
    .then((answers) => {
        switch(answers.goal) {
            case "Project": return generatorProject();
            case "Package / Library": return generatorPackage();
            case "Module": return generatorModule();
            case "Component": return generatorComponent();
        }
    });


function applyArguments() {
    let cwd = "";
    if (process.argv.length >= 3) {
        cwd = process.argv[2];
    }
    try {
        process.chdir(path.join(process.cwd(), cwd));
    } catch (err) {
        console.log(err);
    }
}
