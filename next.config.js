const withFonts = require("next-fonts");

const nextConfiguration = withFonts({
  webpack(config, options) {
    config.node = {
      fs: "empty",
    };
    config.module.rules.push({
      test: /\.(png|woff|woff2|eot|ttf|svg)$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "url-loader?limit=100000",
        },
        {
          loader: "file-loader",
        },
      ],
    });
    return config;
  },
  env: {
    FIREBASE_WEB_API_KEY: process.env.FIREBASE_WEB_API_KEY,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    REPOD_API_URL: process.env.REPOD_API_URL,
  },
});

module.exports = nextConfiguration;
