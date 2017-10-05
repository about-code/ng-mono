var path = require("path")
    ,conflict = require("gulp-conflict")
    ,gulp = require("gulp")
    ,gutil = require("gulp-util")
    ,template = require("gulp-template")
    ,inject = require("gulp-inject-string")
    ,filter = require("gulp-filter")
    ,plumber = require("gulp-plumber");

const REGEX_COUNTER = /::[0-9]*/;


// Note: A regexp. of
//   (.*)\/[\/\*]\*? ::([0-9]*)([^]*)(\*\/)?
//   |1-|              |--2---||-3--||--4--|
// would always have the multi-line-comment stop sequence */ in the third AND
// fourth capture group, because [^]* in the third group matches basically any
// character. However, the third capture group must only contain the comment body.
// So to exclude the */ stop sequence we must do a "positive lookahead" using
// (?= ) syntax:
//   (.*)\/[\/\*]\*? ::([0-9]*)([^]*)(?=\*\/)(\*\/)?
//   |1-|              |--2---||-3--||------||--4--|
//
// Now */ won't be longer part of the string of capture group 3.
const REGEX_MULTILINE_SNIPPET = /(.*)\/\* ::([0-9]*)\n([^]*)(?=\*\/)(\*\/)?/;
const REGEX_SNIPPET = /(.*)\/\/ ::([0-9]*) (.*)/;
const REGEX_VAR = /{{([^{}][\s\S]+?)}}/g;

/**
 * Use this to process code snippets within source files. Code snippets are
 * comments inside source code files which can be instantiated by this
 * task. Instantiation can be thought of as a sequence
 *
 *   - copying a snippet comment
 *   - uncommenting the snippet comment
 *   - replacing variables/placeholders in the uncommented code snippet (it is now "instantiated")
 *   - if: the copied snippet comment had an instantiation counter
 *       - reducing the instantiation counter by one
 *   - if: the copied snippet had an instantiation counter and it is greater than zero or if it didn't have an instantiation counter
 *       - insert the copied snippet comment after the latest snippet instance.
 *
 * Snippet comments are identified by the character sequence `// :: ` (TODO: or `/* :: `).
 * The colon may be followed by a counter indicating how often a snippet can be
 * intantiated. For example, the snippet
 *
 *   // ::1 var {{var_name}} = "Hello";
 *
 * can be instantiated only once. The comment will be removed after
 * the snippet has been instantiated the first time.
 *
 * > **Important*** Colons or colons+counter must be wrapped by white spaces.
 *
 * In contrast to above snippet the following comment
 *
 *   // ::2 var {{var_name}} = "Hello";
 *
 * can be instantiated two times. Given the answer for `var_name` was *foo*, then
 * after the comment has been processed the first time, the result will be
 *
 *   var foo = "Hello";
 *   // ::1 var {{var_name}} = "Hello";
 *
 * Note that the counter has been reduced by one. A snippet
 * without a counter will never be removed.
 *
 * # Arrays
 * Sometimes code generation requires to add entries into a collection. For example
 * var foo = [
 *       // :: [,]{{value}}
 * ];
 * ```
 * We've placed a snippet in an empty array definition; We must indicate by a
 * leading `[,]` that any snippet instantiation apart from the first one must
 * begin with a comma such that when snippets are instantiated repeatedly we
 * will yield something like
 * ```
 * var foo = [
 *      FooComp1
 *      // :: ,{{comp_classname}}
 * ];
 * ```
 * You see that `[,]` will be replaced with `,` after the very first instantiation
 * causing any further instantiation to begin with a leading comma.
 */
module.exports = function (context) {

    return new Promise((resolve, reject) => {
        let currentFile;
        const { answers, processSnippets } = context;
        const replacer = function (comment, $1_spaces, $2_counter, $3_snippetTemplate) {
            if ($2_counter) {
                $2_counter = parseInt($2_counter) - 1;
            } else {
                $2_counter = '';
            }
            // Replace [,] with , to include comma with each further instance
            // Replace counter with new value decremented by one.
            comment = comment
                .replace(/\[(,.*)\]/, (str, $1) => `${$1}`)
                .replace(REGEX_COUNTER, `::${$2_counter}`);

            // Remove [,] from snippet instance
            // Replace variables in result
            let snippetInstance = $3_snippetTemplate
                .replace(/\[,.*\]/, '')
                .replace(REGEX_VAR, (str, $1_varName) => {
                    return answers[$1_varName] || str;
                });

            // Make sure
            let remainingVars = snippetInstance.match(REGEX_VAR);
            if (remainingVars && remainingVars.length > 0) {
                remainingVars.forEach((varName) => {
                    gutil.log(`WARN: Missing answer for snippet variable ${varName} in ${currentFile}. Skipping whole snippet.`);
                });
                return comment;
            }

            // Re-insert snippet to allow further instances if there's no counter or counter grater 0
            if (typeof $2_counter === "string" || $2_counter > 0) {
                return `${$1_spaces}${snippetInstance}\n${comment}`;
            } else {
                return `${$1_spaces}${snippetInstance}`;
            }
        };
        gulp.src(processSnippets.filesGlob)
            .pipe(plumber())
            .pipe(filter((vinylFile) => {
                currentFile = vinylFile.path;
                return true;
            }))
            // match single-line and multi-line comment snippets
            .pipe(inject.replace(REGEX_SNIPPET, replacer))
            .pipe(inject.replace(REGEX_MULTILINE_SNIPPET, replacer))
            .pipe(gulp.dest(function(file) {
                return file.base; // Make sure to write the input file.
            }))
            .on('end', () => resolve(context));
    });
}
