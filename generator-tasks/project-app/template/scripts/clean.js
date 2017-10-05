var rimraf = require("rimraf");
rimraf("./packages/**/dist", (err) => err && console.error(err));
rimraf("./dist", (err) => err && console.error(err));
