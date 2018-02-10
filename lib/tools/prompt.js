let path = require('path')
    fs = require('fs')
    inquirer = require('inquirer')
    ,config = require('../../config.js');

module.exports = function(key, questions) {
    let settings = {};
    let settingsFile = path.resolve(process.cwd(), config.defaults.settingsFile);
    try {
        //console.log(`Reading settings from ${settingsFile}`);
        let data = fs.readFileSync(settingsFile, { encoding: 'utf-8'});
        if (data) {
            settings = Object.assign(JSON.parse(data));
        }
        let previousAnswers = settings[key] || {};
        for (q of questions) {
            let prevAnswer = previousAnswers[q.name];
            if (prevAnswer) {
                q.default = prevAnswer;
            }
        }
    } catch (err) {
        // console.log("No settings file found.");
        // No settings file found. Proceed with questions.
    }
    return inquirer
        .prompt(questions)
        .then((answers) => {
            if (answers.hasOwnProperty("confirm") && !answers.confirm) {
                process.exit(0);
            }
            return answers; // return context object
        });
}
