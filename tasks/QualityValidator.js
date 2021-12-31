const fs = require('fs');
const glob = require('glob');
const path = require('path');
const nodeW3CValidator = require('node-w3c-validator');
const cssValidate = require('css-validator');
const brokenLinkChecker = require('broken-link-checker');
const constants = require('./constants.js');

module.exports = class QualityValidator {
    constructor(isPrd) {
        this.isPrd = isPrd

        this.outDir = constants.logPath
        this.buildPath = constants.buildPath
    }

    html() {
        console.log('html-validator')
        const htmlPatt = `${constants.buildPath}**/*.html`
        const htmls = glob.sync(htmlPatt)
        const logFile = path.join(this.outDir, 'html-validator.log')

        htmls.forEach(file => {
            // IMPORTANT: You need to install the "Java"
            nodeW3CValidator(
                file,
                {
                    format: 'json',
                    skipNonHtml: true,
                    verbose: true
                },
                (err, data) => {
                    let suff = 'Seuccess: ';
                    if (err) {
                        suff = 'Error: '
                        data = JSON.stringify(JSON.parse(data), null , '\t')
                    }

                    console.log(data)

                    this._readFile(logFile).then((ctx) => {
                        nodeW3CValidator.writeFile(logFile, [ctx, suff+data].join('\n'));
                    })
                }
            )
        })
    }

    css() {
        console.log('css-validator')
        const logFile = path.join(this.outDir, 'css-validator.log')

        this._readFile(`${constants.buildPath}assets/styles/style.css`).then((ctx) => {
            cssValidate(ctx, (err, data) => {
                if (err) {
                    console.log(err)
                    return;
                }
                console.log(data);
                fs.writeFileSync(
                    logFile,
                    JSON.stringify(data, null , '\t'),
                    'utf8',
                    (e) => {
                        if (e) {
                            console.log(e)
                        }
                    }
                )
            });
        })
    }

    brokenLinkChecker() {
        // TODO
    }

    async _readFile(file) {
        return await fs.readFileSync(file, 'utf8', (err, ctx) => {
            if (err) {
                console.log(err)
                return
            }

            return ctx;
        })
    }
}
