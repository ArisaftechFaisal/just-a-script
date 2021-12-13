const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new CspHtmlWebpackPlugin(
    {
      "default-src": "'self'",
      // "base-uri": "'self'",
      // "object-src": "'none'",
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "style-src": ["'self'", "*.googleapis.com", "'unsafe-inline'"],
      "style-src-elem": ["'self'", "*.googleapis.com", "'unsafe-inline'"],
      // "font-src": ["'self'", "*.googleapis.com"],
    },
    {
      nonceEnabled: false,
    }
  ),
  new CopyPlugin({
    patterns: [
      { from: "src/main/channels.js" },
      { from: "src/main/preload.js" },
    ],
  }),
];
