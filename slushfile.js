let gulp = require("gulp")
    ,generatorProject   = require("./generator-tasks/project-app/generator")
    ,generatorPackage   = require("./generator-tasks/package-feature/generator")
    ,generatorModule    = require("./generator-tasks/class-ng-module/generator")
    ,generatorComponent = require("./generator-tasks/class-ng-component/generator")

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
            case "Project": return generatorProject();
            case "Package / Library": return generatorPackage(done);
            case "Module": return generatorModule(done);
            case "Component": return generatorComponent(done);
        }
    });
});
gulp.task("project",   generatorProject);
gulp.task("package",   generatorPackage);
gulp.task("module",    generatorModule);
gulp.task("component", generatorComponent);
