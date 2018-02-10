var rename = require("gulp-rename");

module.exports = function(answers) {
    return rename((_path) => {
        // rename {{some_var}}  (if answer[some_var] is empty repl. w. 'some_var')
        // rename {{+some_var}} (if answer[some_var] is empty repl. w. '')
        let templateRegExp = new RegExp(/\{\{(\+?)([a-zA-Z0-9._+\-@!*]*)\}\}/g),
            templateReplacer = (str, $1_isOptional, $2_varname) => {
                let answerExists = answers[$2_varname];
                if(!answerExists) {
                    if ($1_isOptional) {
                        return '';
                    } else {
                        return $2_varname;
                    }
                } else {
                    return answerExists;
                }
            };
        _path.dirname  = _path.dirname.replace(templateRegExp,  templateReplacer).toLowerCase();
        _path.basename = _path.basename.replace(templateRegExp, templateReplacer);
        _path.basename = _path.basename.replace(/^_/,  '');
    });
};
