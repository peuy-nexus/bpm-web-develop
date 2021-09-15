const fs = require("fs-extra");
const replace = require("replace");

class HealthPlugin {
  apply() {
    fs.copy(`./health.json`, "./public/health.json")
      .then(() => {
        replace({
          regex: "#{timestamp}",
          replacement: `${new Date().toJSON()}`,
          paths: ["./public/health.json"],
          recursive: true,
          silent: true,
        });
        replace({
          regex: "#{version}",
          replacement: process.env.imageVersion,
          paths: ["./public/health.json"],
          recursive: true,
          silent: true,
        });
      })
      .catch(err => console.error(err));
  }
}

module.exports = HealthPlugin;
