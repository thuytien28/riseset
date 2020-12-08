/*************************
 * Copyright (c) 2018-present RisesetJournal, Inc. All Rights Reserved
 * See LICENSE.txt for license information.
 *************************/
module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    env: {
        production: {
            plugins: ['transform-remove-console'],
        },
    },
    plugins: [
        '@babel/plugin-transform-runtime',
        [
            'module-resolver',
            {
                root: ['.'],
                alias: {
                    assets: './assets',
                },
            },
        ],
    ],
    exclude: ['**/*.png', '**/*.jpg', '**/*.gif'],
};
