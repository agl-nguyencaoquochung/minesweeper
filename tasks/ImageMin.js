const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const constants = require('./constants.js')

const IMAGE_DIR = 'assets/images/'

module.exports = class ImageMin {
    static async build() {
        await imagemin(
            [`${constants.srcPath}${IMAGE_DIR}*.{jpg,jpeg,png,svg,gif}`],
            {
                destination: `${constants.buildPath}${IMAGE_DIR}`,
                plugins: [
                    imageminMozjpeg({
                        progressive: true,
                        quality: 95,
                    }),
                    imageminPngquant({
                        quality: [
                            0.6,
                            0.9,
                        ]
                    }),
                    imageminSvgo()
                ]
            }
        );
    }

    low() {
        // TODO:
    }

    webp() {
        // TODO:
    }

    avif() {
        // TODO:
    }
}
