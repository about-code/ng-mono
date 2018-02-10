let process = require('process')
    ,path = require('path')
    ,copyTemplate = require("../../lib/tools/copy-template")
    ,processSnippets = require("../../lib/tools/process-snippets")
    ,writeConfig = require("../../lib/tools/write-config")
    ,prompt  = require("../../lib/tools/prompt")
    ,config = require("../../config.js");

const KEY = 'package-feature'
const {packageNameRule} = config.conventions;
const {packageName, packageScope} = config.defaults;

module.exports = function package() {
    return prompt(KEY, [
        {type: "input",   name: "pkg_fullname",        required: true,  message: "Full package name (kebab-case):", default: `${packageScope}/${packageName}`, filter: packageNameRule},
        {type: "input",   name: "pkg_description",     required: false, message: "Short feature description (max. one sentence):"},
        {type: "input",   name: "pkg_version",         required: true,  message: "Initial version:", default: "1.0.0"},
        {type: "input",   name: "pkg_author",          required: false, message: "Authorship:", default: "anonymous"},
        {type: "confirm", name: "confirm",             required: true,  message: "Ready?"}
    ])
    .then(function(answers) {
        let { pkg_fullname } = answers;
        pkg_fullname = pkg_fullname.split("/");
        return {
            answers: Object.assign(answers, {
                "pkg_scope":  pkg_fullname.length > 1 ? pkg_fullname[0] : undefined,
                "pkg_name":   pkg_fullname.length > 1 ? pkg_fullname[1] : pkg_fullname[0]
            }),
            copyTemplate: {
                templateDir: path.join(__dirname, "./template"),
                targetDir:   path.join(process.cwd(), 'packages')
            },
            writeConfig: { key: KEY }
        };
    })
    .then(copyTemplate)
    .then(writeConfig);
};
