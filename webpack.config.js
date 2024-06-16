const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  entry: "./js/complete-lyrics.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.CLIENT_ID_SPOTIFY": JSON.stringify(
        process.env.CLIENT_ID_SPOTIFY
      ),
      "process.env.SECRET_CLIENT_ID_SPOTIFY": JSON.stringify(
        process.env.SECRET_CLIENT_ID_SPOTIFY
      ),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
