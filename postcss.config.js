module.exports = {
    plugins: {
        'css-mqpacker': {
            sort: true,
        },
        'css-declaration-sorter': {
            order: 'smacss',
        },
        'autoprefixer': {
            grid: true,
            cascade: false
        }
    }
}