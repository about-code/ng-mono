let process = require('process')
    ,path = require('path')
    ,config = require("../../config.js")
    ,copyTemplate = require("../../tasks/copy-template")
    ,processSnippets = require("../../tasks/process-snippets")
    ,writeConfig = require("../../tasks/write-config")
    ,prompt  = require("../../tasks/prompt");

const KEY = 'project-app'
const {packageNameRule, classNameRule} = config.conventions;
const {packageName, packageScope} = config.defaults;

module.exports = function ngModule() {
    return prompt([
        {type: "input",   name: "exported_name", required: true,  message: "Module-Class Name (CamelCase):", filter: classNameRule},
        {type: "input",   name: "pkg_fullname",  required: true,  message: "Target package (kebab-case)", default: `${packageScope}/${packageName}`, filter: packageNameRule},
        {type: "confirm", name: "bool_export",   required: false, message: "Should the target package export the module class?", default: 'y'},
        {type: "confirm", name: "confirm",       required: true,  message: "Ready?"}
    ])
    .then(function(answers) {
        let {pkg_fullname, exported_name, bool_export} = answers;
        let config = {
            answers: Object.assign(answers, {
                "internal_path": './' + path.join('src', exported_name)
            }),
            copyTemplate: {
                templateDir: path.join(__dirname, "./template"),
                targetDir:   path.join(process.cwd(), 'packages', pkg_fullname, 'src')
            },
            processSnippets: {
                filesGlob: [
                    bool_export ? path.join(process.cwd(), 'packages', pkg_fullname, 'index.ts') : ''
                ]
            },
            writeConfig: {key: KEY}
        }
        return config;
    })
    .then(copyTemplate)
    .then(processSnippets)
    .then(writeConfig);
};
