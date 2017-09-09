var filter = require("gulp-filter");

module.exports = function(answers) {

    return filter((_vinylFile) => {
        // exclude {{-some_var}} if answer[some_var] is empty
        let templateRegExp = new RegExp(/\{\{(\-?)([a-zA-Z0-9._+\-@!*]*)\}\}/),
            filePath = _vinylFile.path || '',
            matchResult = filePath.match(templateRegExp),
            isOptional = false,
            answerExists;

        if (matchResult) {
            isOptional = matchResult[1];
            answerExists = answers[matchResult[2]];
            if (isOptional && !answerExists) {
                return false; // exclude
            } else {
                return true;  // include
            }
        }
        return true;
    });
}
