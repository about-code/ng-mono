#! /usr/bin/env node

let inquirer = require("inquirer")
    ,generatorProject   = require("../generators/project-app/generator")
    ,generatorPackage   = require("../generators/package-feature/generator")
    ,generatorModule    = require("../generators/class-ng-module/generator")
    ,generatorComponent = require("../generators/class-ng-component/generator")

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
