let path = require("path")
    ,process = require("process")
    ,gulp = require("gulp")
    ,inquirer = require("inquirer")
    ,copyTemplate = require("./tasks/copy-template")
    ,processSnippets = require("./tasks/process-snippets")
    ,installDeps = require("./tasks/install-deps")
    ,changeCase = require("change-case");

// Some Defaults
const WORKSPACE = "./";
const SCOPE = "@foo";
const PKG_NAME = "foo-feature";

// Naming Conventions
let pathRule =              (val) => changeCase.lowerCase(val);
let classNameRule =         (val) => changeCase.upperCaseFirst(changeCase.camelCase(val));
let classFileNameRule =     (val) => changeCase.upperCaseFirst(changeCase.camelCase(val));
let componentSelectorRule = (val) => changeCase.lowerCase(changeCase.paramCase(val));
let packageNameRule =       (val) => val
        .split("/")
        .map((segment) => (segment[0] === '@' ? '@': '') + changeCase.lowerCase(changeCase.paramCase(segment)))
        .join("/");



gulp.task("default", function(done) {
    return inquirer.prompt([
        {type: "list", name: "goal", message: "What do you want to generate?", choices: [
            "Project",
            "Package / Library",
            "Module",
            "Component"
        ]}
    ]).then((answers) => {
        switch(answers.goal) {
            case "Project": return project(done);
            case "Package / Library": return package(done);
            case "Module": return ngModule(done);
            case "Component": return component(done);
        }
    });
});
gulp.task("project", project);
gulp.task("package", package);
gulp.task("module", ngModule);
gulp.task("component", component);

function project(done) {
    return inquirer.prompt([
        {type: "input",   name: "workspace",           required: true,  message: "Workspace:", default: WORKSPACE, filter: pathRule},
        {type: "input",   name: "proj_name",           required: true,  message: "Project name (kebab-case):", filter: packageNameRule},
        {type: "input",   name: "app_ctx_root",        required: true,  message: "App context root (use leading slash):", default: "/", filter: (val) => path.join("/", val, "/").replace(/\\/, "/")},
        {type: "input",   name: "app_title",           required: false, message: "Title to use in browser tabs:"},
        {type: "input",   name: "pkg_scope",           required: true,  message: `NPM Package Scope (kebab-case). e.g. ${SCOPE}:`, filter: packageNameRule},
        {type: "input",   name: "pkg_description",     required: false, message: "Short project description (max. one sentence):"},
        {type: "input",   name: "pkg_version",         required: true,  message: "Initial version:", default: "1.0.0"},
        {type: "input",   name: "pkg_author",          required: false, message: "Authorship:", default: "anonymous"},
        {type: "confirm", name: "bool_default_pkgs",   required: false, message: "Generate app and theme package?", default: "n"},
        {type: "confirm", name: "bool_install_deps",   required: false, message: "Immediately install dependencies?", default: "y"},
        {type: "confirm", name: "confirm",             required: true,  message: "Ready?", default: "y"}
    ])
    .then((answers) => {
        if (! answers.confirm) { process.exit(0); }
        let {workspace, proj_name, pkg_scope, bool_install_deps} = answers;
        let proj_dir = path.join(process.cwd(), workspace, proj_name);
        let config = {
            gulp: gulp,
            answers: Object.assign(answers, {
                "proj_dir": proj_dir,
                "pkg_name": `${proj_name}-app`,
                "pkg_fullname": pkg_scope + (pkg_scope ? "/" : "") + proj_name + "-app"
            }),
            copyTemplate: {
                templateDir: path.join(__dirname, "./templates/files-project-package"),
                targetDir:   proj_dir,
            },
            installDeps: {
                auto_install: bool_install_deps,
                targetDir:   proj_dir
            }
        };
        return config;
    })
    .then(copyTemplate)
    .then(function (config) {
        // Generate app and theme package?
        let {workspace, proj_name, pkg_fullname, bool_default_pkgs} = config.answers;
        if (bool_default_pkgs) {
            // answer: yes
            config.copyTemplate = {
                templateDir: path.join(__dirname, "./templates/files-feature-app-default"),
                targetDir:   path.join(process.cwd(), workspace, proj_name, 'packages')
            };
            config.processSnippets = {
                filesGlob: [
                    path.join(process.cwd(), workspace, proj_name, "**/bundle-theme.ts"), // add import of index.scss
                ]
            }
        } else {
            // answer: no
            config.copyTemplate = { templateDir: "./null", targetDir: "./null" };
            config.processSnippets = { filesGlob: [] };
        }
        return config;
    })
    .then(copyTemplate)
    .then(processSnippets)
    .then(installDeps);
}

function package(done) {
    return inquirer.prompt([
        {type: "input",   name: "workspace",           required: true,  message: "Workspace:", default: WORKSPACE, filter: pathRule},
        {type: "input",   name: "proj_name",           required: true,  message: "Target project (kebab-case):", filter: packageNameRule},
        {type: "input",   name: "pkg_fullname",        required: true,  message: "Full package name (kebab-case):", default: `${SCOPE}/${PKG_NAME}`, filter: packageNameRule},
        {type: "input",   name: "pkg_description",     required: false, message: "Short feature description (max. one sentence):"},
        {type: "input",   name: "pkg_version",         required: true,  message: "Initial version:", default: "1.0.0"},
        {type: "input",   name: "pkg_author",          required: false, message: "Authorship:", default: "anonymous"},
        {type: "confirm", name: "confirm",             required: true,  message: "Ready?"}
    ])
    .then(function(answers) {
        if (! answers.confirm) { process.exit(0); }
        let {workspace, proj_name, pkg_fullname} = answers;
        pkg_fullname = pkg_fullname.split("/");
        return {
            gulp: gulp,
            answers: Object.assign(answers, {
                "pkg_scope":  pkg_fullname.length > 1 ? pkg_fullname[0] : undefined,
                "pkg_name":   pkg_fullname.length > 1 ? pkg_fullname[1] : pkg_fullname[0]
            }),
            copyTemplate: {
                templateDir: path.join(__dirname, "./templates/files-feature-package"),
                targetDir:   path.join(process.cwd(), workspace, proj_name, 'packages')
            }
        };
    })
    .then(copyTemplate);
}

function component(done) {
    return inquirer.prompt([
        {type: "input",   name: "workspace",     required: true, message: "Workspace:", default: WORKSPACE, filter: pathRule},
        {type: "input",   name: "proj_name",     required: true, message: "Target project (kebab-case):", filter: packageNameRule},
        {type: "input",   name: "pkg_fullname",  required: true, message: "Target package (Feature Package):", default: "@foo/foo-feature", filter: packageNameRule},
        {type: "input",   name: "comp_name",     required: true, message: "Component class name (CamelCase):", filter: classNameRule},
        {type: "input",   name: "comp_selector", required: true, message: "Component Selector (kebab-case):", filter: componentSelectorRule},
        {type: "input",   name: "comp_route",    required: true, message: "Component route (all lowercase):", filter: pathRule},
        {type: "confirm", name: "confirm",       required: true, message: "Ready?"}
    ])
    .then(function(answers) {
        if (! answers.confirm) { process.exit(0); }
        let {workspace, proj_name, comp_name, pkg_fullname} = answers;
        let targetDir = path.join(process.cwd(), workspace, proj_name, 'packages', pkg_fullname, 'src');
        return {
            gulp: gulp,
            answers: Object.assign(answers, {
                "comp_class": comp_name,
                "comp_file":  comp_name
            }),
            copyTemplate: {
                templateDir: path.join(__dirname, "./templates/ng-component"),
                targetDir: targetDir,
            },
            processSnippets: {
                filesGlob: [targetDir + "/**/*.ts"]
            }
        }
    })
    .then(copyTemplate)
    .then(processSnippets);
}

function ngModule(done) {
    return inquirer.prompt([
        {type: "input",   name: "workspace",     required: true,  message: "Workspace", default: WORKSPACE, filter: pathRule},
        {type: "input",   name: "proj_name",     required: true,  message: "Target project (kebab-case):", filter: packageNameRule},
        {type: "input",   name: "pkg_fullname",  required: true,  message: "Target package (kebab-case)", default: `${SCOPE}/${PKG_NAME}`, filter: packageNameRule},
        {type: "input",   name: "exported_name", required: true,  message: "Module-Class Name (CamelCase):", filter: classNameRule},
        {type: "input",   name: "internal_path", required: true,  message: "Internal path within package", default: "./src", filter: pathRule},
        {type: "confirm", name: "bool_export",   required: false, message: "Should the target package export the module class?", default: 'y'},
        {type: "confirm", name: "confirm",       required: true,  message: "Ready?"}
    ])
    .then(function(answers) {
        if (! answers.confirm) { process.exit(0); }
        let {
            workspace, proj_name, pkg_fullname, internal_path, exported_name,
            bool_export
        } = answers;
        let config = {
            gulp: gulp,
            answers: Object.assign(answers, {
                "internal_path": './' + path.join(internal_path, exported_name)
            }),
            copyTemplate: {
                templateDir: path.join(__dirname, "./templates/ng-module"),
                targetDir:   path.join(process.cwd(), workspace, proj_name, 'packages', pkg_fullname, internal_path)
            },
            processSnippets: {
                filesGlob: [
                    bool_export ? path.join(process.cwd(), workspace, proj_name, 'packages', pkg_fullname, 'index.ts') : ''
                ]
            }
        }
        return config;
    })
    .then(copyTemplate)
    .then(processSnippets);
}
