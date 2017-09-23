const process = require('process')
    ,path = require('path')
    ,template = require('gulp-template')
    ,conflict = require('gulp-conflict')
    ,gulp = require('gulp')
    ,gutil = require('gulp-util')
    ,plumber = require('gulp-plumber')
    //
    ,templateFileFilter = require('../plugins/templateFileFilter')
    ,templateFileRename = require('../plugins/templateFileRename');

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
        gulp
            .src(`${templateDir}/**/*`)
            .pipe(plumber())
            .pipe(template(answers, {
                // Set custom interpolation pattern <%= ... %>. Default
                // pattern seems to include ${...} which conflicts with ES6
                // template strings.
                // see https://github.com/lodash/lodash/issues/399
                // see https://github.com/lodash/lodash/issues/1009
                interpolate: /<%=([\s\S]+?)%>/g
             }))
            .pipe(templateFileFilter(answers))
            .pipe(templateFileRename(answers))
            .pipe(conflict(targetDir, {
                logger: function(msg, filename) {
                    gutil.log(`${msg} ${filename}`);
                }
            }))
            .pipe(gulp.dest(targetDir))
            .on('end', () => resolve(context))
            .resume();
    });
};

