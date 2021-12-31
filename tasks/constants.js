const path = require('path');
const slash = require('slash')
const BaseDirectoryPath = slash(path.dirname(__dirname));

module.exports = {
    srcPath: `${BaseDirectoryPath}/src/`,
    buildPath: `${BaseDirectoryPath}/dist/`,
    logPath: `${BaseDirectoryPath}/log/`,
}
