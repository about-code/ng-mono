let process = require('process')
    ,path = require('path')
    ,copyTemplate = require("../../lib/tools/copy-template")
    ,processSnippets = require("../../lib/tools/process-snippets")
    ,writeConfig = require("../../lib/tools/write-config")
    ,prompt  = require("../../lib/tools/prompt")
    ,config = require("../../config.js");

const KEY = 'class-ng-component'
const {packageNameRule, classNameRule, componentSelectorRule, routeRule} = config.conventions;
const {packageName, packageScope} = config.defaults;

module.exports = function package() {
    return prompt(KEY, [
        {type: "input",   name: "comp_name",     required: true, message: "Component class name (CamelCase):", filter: classNameRule},
        {type: "input",   name: "comp_selector", required: true, message: "Component Selector (kebab-case):", filter: componentSelectorRule},
        {type: "input",   name: "comp_route",    required: true, message: "Component route (all lowercase):", filter: routeRule},
        {type: "input",   name: "pkg_fullname",  required: true, message: "Target package (Feature Package):", default: "@foo/foo-feature", filter: packageNameRule},
        {type: "confirm", name: "confirm",       required: true, message: "Ready?"}
    ])
    .then((answers) => {
        let {comp_name, pkg_fullname} = answers;
        let targetDir = path.join(process.cwd(), 'packages', pkg_fullname, 'src');
        return {
            answers: Object.assign(answers, {
                "comp_class": comp_name,
                "comp_file":  comp_name
            }),
            copyTemplate: {
                templateDir: path.join(__dirname, "./template"),
                targetDir: targetDir,
            },
            processSnippets: {
                filesGlob: [targetDir + "/**/*.ts"]
            },
            writeConfig: { key: KEY }
        }
    })
    .then(copyTemplate)
    .then(processSnippets)
    .then(writeConfig);
};
