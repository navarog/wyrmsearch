const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      if (env === "production") {
        // remove css minimizer
        webpackConfig.optimization.minimizer =
          webpackConfig.optimization.minimizer.filter(
            (plugin) => !(plugin instanceof CssMinimizerPlugin)
          );
      }
      // Add path alias
      webpackConfig.resolve.alias["@"] = path.resolve(__dirname, "src/");
      return webpackConfig;
    },
  },
};

