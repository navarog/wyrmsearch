const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

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
      return webpackConfig;
    },
  },
};
