const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const templatesJSON = require('./templates.json');
const fs = require('fs');

module.exports = (env, argv) => {
    const isProd = argv.mode === 'production'; // Определение, находится ли проект в режиме продакшн
    const project = env.project; // Получение переменной project из командной строки
    const htmlPath = `../../templates/html/`; // Путь для сохранения HTML файлов (Django шаблоны)
    const assetsPath = `../static/`; // Путь для сохранения скомпилированных шаблонов
    const plugins = [
        new CleanWebpackPlugin(), // Плагин для очистки выходной директории
        new VueLoaderPlugin(), // Плагин для загрузки файлов Vue
        new MiniCssExtractPlugin({ // Плагин для извлечения CSS в отдельные файлы
            filename: '[name].min.css',
            chunkFilename: '[id].min.css',
        }),
        new CopyWebpackPlugin({ // Плагин для копирования файлов из одной директории в другую
            patterns: [
                {
                    from: path.resolve(__dirname, 'assets/svg/'),
                    to: 'svg/',
                },
                {
                    from: path.resolve(__dirname, 'assets/scripts/'),
                    to: 'scripts/',
                },
            ],
        }),
        new CompressionPlugin(), // Плагин для сжатия файлов в режиме продакшн
        new webpack.ProvidePlugin({
            process: 'process/browser', // Подключение глобальной переменной process (например, для библиотеки validate)
        }),
    ];

    const templates = Object.keys(templatesJSON[project]); // Получение списка шаблонов из файла

    const entry = {
        main: '../../frontend/src/assets/scripts/main.js', // Указываем путь к вашему основному JS-файлу
    };
    
    for (const item of templates) {
        plugins.push(new HtmlWebpackPlugin({
            template: `templates/${item}.hbs`,
            filename: `${htmlPath}${item}.html`,
            minify: false,
            inject: false,
        }));
    }

    const WebpackConfig = {
        target: 'web', // Настройка цели сборки (веб-приложение)
        entry: entry.main, // Задание точек входа для сборки
        output: {
            path: path.resolve(__dirname, assetsPath), // Путь для выходных файлов
            filename: '[name].min.js', // Название выходных JavaScript файлов
            publicPath: '/static/public/', // Публичный путь для доступа к выходным файлам
        },
        module: {
            rules: [
                {
                    test: /\.hbs$/, // Тест на файлы с расширением .handlebars
                    exclude: /node_modules/, // Исключение из обработки файлов из node_modules
                    use: [
                        {
                            loader: 'handlebars-loader', // Загрузчик для компиляции Handlebars шаблонов
                            options: {
                                partialDirs: path.resolve(__dirname, 'partials/'), // Директория с частичными шаблонами
                            },
                        },
                    ],
                },
                {
                    test: /\.js$/, // Тест на файлы с расширением .js
                    exclude: /node_modules/, // Исключение из обработки файлов из node_modules
                    use: {
                        loader: 'babel-loader', // Загрузчик для транспиляции JavaScript
                        options: {
                            presets: [['@babel/preset-env', {
                                useBuiltIns: 'usage', // Использование полифилов только по мере необходимости
                                corejs: '3.1', // Версия библиотеки core-js
                            }]],
                            cacheDirectory: true, // Использование кэша для ускорения сборки
                        },
                    },
                },
                {
                    test: /\.css$/, // Тест на файлы с расширением .css
                    exclude: /node_modules/, // Исключение из обработки файлов из node_modules
                    use: [
                        MiniCssExtractPlugin.loader, // Извлечение CSS в отдельные файлы
                        'css-loader', // Загрузка CSS
                        {
                            loader: 'postcss-loader', // Загрузчик для обработки CSS с PostCSS
                            options: {
                                postcssOptions: {
                                    config: path.resolve(__dirname, "postcss.config.js"), // Путь к файлу конфигурации PostCSS
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/, // Тест на файлы с расширением .css
                    include: /node_modules/, // Включение в обработку файлов из node_modules
                    use: [
                        MiniCssExtractPlugin.loader, // Извлечение CSS в отдельные файлы
                        'css-loader', // Загрузка CSS
                    ],
                },
                {
                    test: /\.css$/,
                    include: path.resolve(__dirname, '../../frontend/src/assets/styles'), // Указываем путь к папке с CSS файлами
                    use: [
                        MiniCssExtractPlugin.loader, // Извлечение CSS в отдельные файлы
                        'css-loader', // Загрузка CSS
                        {
                            loader: 'postcss-loader', // Загрузчик для обработки CSS с PostCSS
                            options: {
                                postcssOptions: {
                                    config: path.resolve(__dirname, "postcss.config.js"), // Путь к файлу конфигурации PostCSS
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.vue$/, // Тест на файлы с расширением .vue
                    loader: 'vue-loader', // Загрузчик для компиляции файлов Vue
                },
                {
                    test: /\.(woff|woff2)$/, // Тест на файлы с расширением .woff и .woff2
                    type: 'asset/resource', // Использование asset modules
                    generator : {
                        filename : '[path][name][ext][query]', // Формат названия выходных файлов
                    },
                },
                {
                    test: /\.(png|jpg|webp|svg)$/, // Тест на файлы с изображениями
                    type: 'asset/resource', // Использование asset modules
                    generator : {
                        filename : '[path][name][ext][query]', // Формат названия выходных файлов
                    },
                },
            ],
        },
        optimization: {
            minimize: !!isProd, // Минимизация JavaScript файлов в режиме продакшн
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: 'vendor',
                        test: /[\\/]node_modules[\\/](vue|axios|vue-click-outside|webp-in-css|js-cookie)[\\/]/, // Выделение общих модулей в vendor.js
                        chunks: 'initial',
                    },
                },
            },
        },
        resolve: {
            alias: {
                vue$: 'vue/dist/vue.esm.js', // Псевдоним для Vue.js
            },
            extensions: ['*', '.js', '.vue', '.json'], // Расширения файлов
        },
        plugins,
    };

    if (argv.mode === 'development') {
        WebpackConfig.devServer = {
            contentBase: path.join(__dirname, 'dist'), // Путь для dev-сервера
            compress: true, // Сжатие файлов
            port: 9000, // Порт для dev-сервера
            writeToDisk: true, // Запись файлов на диск в режиме разработки
            watchContentBase: true, // Отслеживание изменений в файлах
        };
    }

    return WebpackConfig;
};
// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const VueLoaderPlugin = require('vue-loader/lib/plugin');

// module.exports = (env, argv) => {
//   const isProd = argv.mode === 'production';

//   return {
//     entry: {
//       main: '../../frontend/src/assets/scripts/main.js',
//     },
//     output: {
//       filename: '[name].min.js',
//       path: path.resolve(__dirname, 'dist/js'),
//     },
//     module: {
//       rules: [
//         {
//           test: /\.hbs$/,
//           exclude: /node_modules/,
//           use: [
//             {
//               loader: 'handlebars-loader',
//               options: {
//                 partialDirs: [
//                   path.resolve(__dirname, 'partials'),
//                   path.resolve(__dirname, 'templates/layout'),
//                 ],
//               },
//             },
//           ],
//         },
//         {
//           test: /\.vue$/,
//           exclude: /node_modules/,
//           use: 'vue-loader',
//         },
//         {
//           test: /\.css$/,
//           exclude: /node_modules/,
//           use: [
//             MiniCssExtractPlugin.loader,
//             'css-loader',
//           ],
//         },
//         {
//           test: /\.svg$/,
//           include: path.resolve(__dirname, 'src/assets/svg'),
//           type: 'asset/resource',
//           generator: {
//             filename: 'svg/[name][ext][query]',
//           },
//         },
//         // Другие правила для JavaScript и ресурсов
//       ],
//     },
//     plugins: [
//       // Создайте HtmlWebpackPlugin для каждого шаблона Handlebars
//       new HtmlWebpackPlugin({
//         filename: '../../templates/html/layout.html',
//         template: 'templates/layout/layout.hbs',
//         inject: false,
//       }),
//       // Другие HtmlWebpackPlugin для других шаблонов
//       // ...
//       new MiniCssExtractPlugin({
//         filename: '../css/style.min.css',
//       }),
//       new CopyWebpackPlugin({
//         patterns: [
//           {
//             from: path.resolve(__dirname, 'assets/svg/'),
//             to: 'dist/svg/',
//           },
//         ],
//       }),
//       new VueLoaderPlugin(),
//       // Другие плагины
//     ],
//   };
// };
