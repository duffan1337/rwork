module.exports = ({ env }) => ({
    plugins: [
        'postcss-import',
        'postcss-url',
        'postcss-custom-properties',
        ['postcss-custom-media',
            {
                importFrom: {
                    customMedia: {
                        /* >= 480 */
                        '--mobile': '(min-width: 30em)',
                        /* >= 768 */
                        '--tablet': '(min-width: 48em)',
                        /* >= 1024 */
                        '--desktop': '(min-width: 64em)',
                        /* >= 1280 */
                        '--wide': '(min-width: 80em)',
                        /* > 1920 */
                        '--desktop-extra': '(min-width: 120.001em)',
                    },
                },
            }],
        'postcss-nested',
        'postcss-nesting',
        env === 'production' ? 'cssnano' : false,
    ],
});
