const changeCase = require("change-case");

const packageNameRule = (val) => {
    let segments = val
        .split("/")
        .map((segment) => changeCase.lowerCase(changeCase.paramCase(segment)));
    if (segments.length > 1 && segments[0][0] !== '@') {
        segments[0] = '@' + segments[0];
    }
    return segments.join("/");
}

module.exports = {
    defaults: {
        // Some Defaults
        settingsFile: 'ng-mono.json',
        packageScope: "@foo",
        packageName: "foo-feature"
    },
    conventions: {
        routeRule:             (val) => changeCase.lowerCase(val
                                        .replace(/ /, '-')       // replace whitespaces
                                        .replace(/\\/, "/")      // replace backslashes
                                        .replace(/\/(.*)/, '$1') // remove leading slash
                                        .replace(/(.*)\//, '$1') // remove trailing slash
                               ),
        pathRule:              (val) => changeCase.lowerCase(val),
        classNameRule:         (val) => changeCase.upperCaseFirst(changeCase.camelCase(val)),
        classFileNameRule:     (val) => changeCase.upperCaseFirst(changeCase.camelCase(val)),
        componentSelectorRule: (val) => changeCase.lowerCase(changeCase.paramCase(val)),
        packageScopeRule:      (val) => val ? '@' + packageNameRule(val.split('/')[0]) : val,
        packageNameRule:       packageNameRule
    }
};
