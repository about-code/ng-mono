const changeCase = require("change-case");

module.exports = {
    defaults: {
        // Some Defaults
        settingsFile: 'slush-ng-monorepo.json',
        packageScope: "@foo",
        packageName: "foo-feature"
    },
    conventions: {
        pathRule:              (val) => changeCase.lowerCase(val),
        classNameRule:         (val) => changeCase.upperCaseFirst(changeCase.camelCase(val)),
        classFileNameRule:     (val) => changeCase.upperCaseFirst(changeCase.camelCase(val)),
        componentSelectorRule: (val) => changeCase.lowerCase(changeCase.paramCase(val)),
        packageNameRule:       (val) => val
            .split("/")
            .map((segment) => (segment[0] === '@' ? '@': '') + changeCase.lowerCase(changeCase.paramCase(segment)))
            .join("/")
    }
};
