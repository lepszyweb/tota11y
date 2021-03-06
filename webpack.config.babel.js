const fs = require("fs");
const path = require("path");

const handlebars = require("handlebars");
const postcss = require("postcss");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");

const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const TerserPlugin = require('terser-webpack-plugin');

const options = require("./utils/options");

const veryimportant = require("./utils/veryimportant");

const bannerTemplate = handlebars.compile(
    fs.readFileSync("./templates/banner.handlebars", "utf-8"));

module.exports = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    entry: process.env.NODE_ENV === "production" ? {
        "tota11y": "./index.js",
        "tota11y.min": "./index.js",
    } : {
        "tota11y": "./index.js",
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "env",
                                "react",
                            ],
                            plugins: [
                                ["transform-react-jsx", { pragma: options.jsxPragma }]
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.handlebars$/,
                use: [
                    {
                        loader: "handlebars-loader",
                    },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    { loader: "css-loader", options: { importLoaders: 1 } },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    veryimportant,
                                    autoprefixer,
                            ],
                            },
                        }
                    },
                    "less-loader",
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        // Add a banner to our bundles with a version number, date, and
        // license info
        new webpack.BannerPlugin({
            banner: bannerTemplate({
                version: require("./package.json").version,
                date: new Date().toISOString().slice(0, 10),
            }),
            entryOnly: true,
        }),

        // Make the JSX pragma function available everywhere without the need
        // to use "require"
        new webpack.ProvidePlugin({
            [options.jsxPragma]: path.join(__dirname, "utils", "element"),
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/,
                extractComments: false,
            }),
        ],
    },
    devServer: {
        open: true,
        openPage: "test"
    }
};
