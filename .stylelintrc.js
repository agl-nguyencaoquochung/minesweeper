module.exports = {
    extends: 'stylelint-config-sass-guidelines',
    rules: {
        'indentation': 4,
        'order/properties-alphabetical-order': null,
        'order/order': null,
        'block-no-empty': null,
        'no-empty-source': null,
        'no-descending-specificity': null,
        'max-nesting-depth': 6,
        'selector-max-compound-selectors': 8,
        "selector-class-pattern": ["^([a-z0-9]+\-)(([a-z0-9]+?)+)?(__([a-z0-9]+?)+)?(--([a-z0-9]+?)+)?$", {
            "message": "Please class name CSS with FLOCSS",
            "severity": "error"
        }],
        // 'selector-pseudo-class-no-unknown': [
        //     true,
        //     {
        //         'ignorePreudoClases': [
        //             'horizontal',
        //             'start',
        //         ],
        //     },
        // ],
        'selector-no-qualifying-type': [
            true,
            {
                ignore: [
                    'attribute',
                    'class',
                    'id',
                ],
            },
        ],
    },
    ignoreFiles: [
        '/node_modules',
        '/dist',
    ],
};
