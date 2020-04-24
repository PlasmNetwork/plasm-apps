/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { WebpackPluginServe } = require("webpack-plugin-serve");

const ENV = process.env.NODE_ENV || "development";
const isProduction = ENV === "production";
const outputPath = path.join(__dirname, "build");

module.exports = {
  mode: ENV,
  entry: "./src/index.tsx",
  output: {
    filename: "index.[hash:8].js",
    path: outputPath,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : require.resolve("style-loader"),
          require.resolve("css-loader"),
        ],
      },
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /(node_modules)/,
        use: "ts-loader",
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "static/[name].[hash:8].[ext]",
              esModule: false,
            },
          },
        ],
      },
      {
        test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
        use: [
          {
            loader: require.resolve("file-loader"),
            options: {
              name: "static/[name].[hash:8].[ext]",
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(ENV),
        WS_URL: JSON.stringify(process.env.WS_URL),
      },
    }),
    new CopyWebpackPlugin([{ from: "public" }]),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: "public/index.html",
      PAGE_TITLE: "Plasm Network Portal",
    }),
    isProduction
      ? null
      : new WebpackPluginServe({
          hmr: false,
          liveReload: false,
          progress: false,
          port: 3000,
          static: outputPath,
          historyFallback: true,
        }),
  ].filter((plugin) => plugin),
  watch: !isProduction,
};