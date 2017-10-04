let process = require('process')
    ,path = require('path')
    ,inquirer = require("inquirer")
    ,config = require("../../config.js")
    ,copyTemplate = require("../../tasks/copy-template")
    ,processSnippets = require("../../tasks/process-snippets")
    ,installDeps = require("../../tasks/install-deps")
    ,writeConfig = require("../../tasks/write-config")
    ,prompt  = require("../../tasks/prompt");

const KEY = 'project-app'
const {packageNameRule} = config.conventions;
const {packageScope} = config.defaults;

module.exports = function project() {
    return prompt(KEY, [
        {type: "input",   name: "proj_name",           required: true,  message: "Project name (kebab-case):", filter: packageNameRule},
        {type: "input",   name: "app_ctx_root",        required: true,  message: "App context root (use leading slash):", default: "/", filter: (val) => path.join("/", val, "/").replace(/\\/, "/")},
        {type: "input",   name: "app_title",           required: false, message: "Title to use in browser tabs:"},
        {type: "input",   name: "pkg_scope",           required: true,  message: `NPM Package Scope e.g. ${packageScope} (kebab-case):`, filter: packageNameRule},
        {type: "input",   name: "pkg_description",     required: false, message: "Short project description (max. one sentence):"},
        {type: "input",   name: "pkg_version",         required: true,  message: "Initial version:", default: "1.0.0"},
        {type: "input",   name: "pkg_author",          required: false, message: "Authorship:", default: "anonymous"},
        {type: "confirm", name: "bool_default_pkgs",   required: false, message: "Generate app and theme package?", default: "n"},
        {type: "confirm", name: "bool_install_deps",   required: false, message: "Immediately install dependencies?", default: "y"},
        {type: "confirm", name: "confirm",             required: true,  message: "Ready?", default: "y"}
    ])
    .then((answers) => {
        let {proj_name, pkg_scope, bool_install_deps} = answers;
        let proj_dir = path.join(process.cwd(), proj_name);
        let context = {
            answers: Object.assign(answers, {
                "pkg_name": `${proj_name}-app`,
                "pkg_fullname": pkg_scope + (pkg_scope ? "/" : "") + proj_name + "-app",
                // "proj_dir": proj_dir,
                "proj_pkg_fullname": pkg_scope + (pkg_scope ? "/" : "") + proj_name + "-project"
            }),
            copyTemplate: {
                templateDir: path.join(__dirname, "./template"),
                targetDir:   proj_dir,
            },
            writeConfig: {
                key: KEY,
                path: proj_dir
            },
            installDeps: {
                auto_install: bool_install_deps,
                targetDir:   proj_dir
            },
        };
        return context;
    })
    .then(copyTemplate)
    .then(writeConfig)
    .then(function(context) {
        // Generate app and theme package?
        let {proj_name, pkg_fullname, bool_default_pkgs} = context.answers;
        if (bool_default_pkgs) {
            // answer: yes
            context.copyTemplate = {
                templateDir: path.join(__dirname, "../package-app/template"),
                targetDir:   path.join(process.cwd(), proj_name, 'packages')
            };
            context.processSnippets = {
                filesGlob: [
                    path.join(process.cwd(), proj_name, "**/bundle-theme.ts"), // add import of index.scss
                ]
            }
        } else {
            // answer: no
            context.copyTemplate = { templateDir: "./null", targetDir: "./null" };
            context.processSnippets = { filesGlob: [] };
        }
        return context;
    })
    .then(copyTemplate)
    .then(processSnippets)
    .then(installDeps);
};
