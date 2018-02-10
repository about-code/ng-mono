let process = require('process')
    ,path = require('path')
    ,copyTemplate = require("../../lib/tools/copy-template")
    ,processSnippets = require("../../lib/tools/process-snippets")
    ,writeConfig = require("../../lib/tools/write-config")
    ,prompt  = require("../../lib/tools/prompt")
    ,config = require("../../config.js");

const KEY = 'class-ng-module'
const {packageNameRule, classNameRule} = config.conventions;
const {packageName, packageScope} = config.defaults;

module.exports = function module() {
    return prompt(KEY, [
        {type: "input",   name: "exported_name", required: true,  message: "Module-Class Name (CamelCase):", filter: classNameRule},
        {type: "input",   name: "pkg_fullname",  required: true,  message: "Target package (kebab-case)", default: `${packageScope}/${packageName}`, filter: packageNameRule},
        {type: "confirm", name: "bool_export",   required: false, message: "Should the target package export the module class?", default: 'y'},
        {type: "confirm", name: "confirm",       required: true,  message: "Ready?"}
    ])
    .then(function(answers) {
        let {pkg_fullname, exported_name, bool_export} = answers;
        let context = {
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
        return context;
    })
    .then(copyTemplate)
    .then(processSnippets)
    .then(writeConfig);
};
