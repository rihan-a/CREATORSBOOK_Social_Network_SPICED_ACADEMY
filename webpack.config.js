const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => ({
    entry: [
        "@babel/polyfill",
        path.join(__dirname, "client", "style.css"),
        path.join(__dirname, "client", "src", "index.js"),
    ],
    output: {
        path: path.join(__dirname, "client", "public"),
        filename: "bundle.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "client", "src", "index.html"), // Corrected path
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: "bundle.css",
        }),
    ],
    performance: {
        hints: false,
    },
    devServer: {
        static: path.join(__dirname, "client", "public"),
        proxy: {
            "/": {
                target: "http://localhost:3001",
            },
            "/socket.io": {
                target: "http://localhost:3001",
                ws: true,
            },
        },
        port: "3000",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                        },
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
});