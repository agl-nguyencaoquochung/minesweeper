const program = require('commander')
const ScreenshotLog = require('./ScreenshotLog.js')

let beforePath
let afterPath

program
    .version('1.0.0')
    .argument('<before>')
    .argument('<after>')
    .action((before, after) => {
        beforePath = before
        afterPath = after
    })
    .parse(process.argv);

const screenshotLog = new ScreenshotLog(1)
screenshotLog.diff(beforePath, afterPath)
