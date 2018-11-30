const process = require('process')
    ,path = require('path')
    ,template = require('gulp-template')
    ,conflicts = require('gulp-conflicts')
    ,gulp = require('gulp')
    ,log = require('fancy-log')
    ,pump = require('pump')
    //
    ,templateFileFilter = require('../gulp-plugins/templateFileFilter')
    ,templateFileRename = require('../gulp-plugins/templateFileRename');

/**
 * Renaming rules, given answer 'foo' for prompt variable 'some_var':
 *
 * - {{some_var}} => foo
 * - path/to/{{some_var}} => path/to/foo
 * - path/to/{{some_var}}.txt => path/to/foo.txt
 *
 * Hidden files
 * - _.gitignore => .gitignore
 *
 * Given 'some_var' is null or empty:
 * - template/{{some_var}}/README.md  => target/some_var/README.md
 * - template/{{+some_var}}/README.md => target/README.md
 * - template/{{-some_var}}/README.md => not copied.
 *
 * @return Promise
 */
module.exports = function(context) {

    return new Promise((resolve, reject) => {
        let { answers, copyTemplate } = context;
        let { targetDir, templateDir, install_deps} = copyTemplate;
        let { confirm } = answers;
        if (!confirm) {
            reject();
        }
        pump([
            gulp.src(`${templateDir}/**/*`)
            , template(answers, {
                // Set custom interpolation pattern <%= ... %>. Default
                // pattern seems to include ${...} which conflicts with ES6
                // template strings.
                // see https://github.com/lodash/lodash/issues/399
                // see https://github.com/lodash/lodash/issues/1009
                interpolate: /<%=([\s\S]+?)%>/g
             })
            , templateFileFilter(answers)
            , templateFileRename(answers)
            , conflicts(targetDir)
            ,gulp.dest(targetDir)
        ], (err) => err ? reject(err) : resolve(context));
    });
};

